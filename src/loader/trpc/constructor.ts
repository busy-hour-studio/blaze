import type { Blaze } from '../../router/Blaze';
import type {
  TrpcMutationCallRecord,
  TrpcQueryCallRecord,
} from '../../types/external';
import type { GroupTrpcAction, TrpcProcedure } from '../../types/trpc';
import type { BlazeServiceAction } from '../action';
import { getTrpcInput, trpcHandler } from './helper';

export class TrpcConstructor {
  public readonly app: Blaze;
  public readonly procedure: TrpcProcedure;
  public readonly actions: BlazeServiceAction[];
  public readonly trpcActions: GroupTrpcAction;

  private $trpcMutations: TrpcMutationCallRecord | null;
  private $trpcQueries: TrpcQueryCallRecord | null;

  constructor(app: Blaze, procedure: TrpcProcedure) {
    this.app = app;
    this.procedure = procedure;

    this.actions = this.app.services.map((service) => service.actions).flat(1);
    this.actions = this.actions.filter((action) => action.action.trpc);

    this.trpcActions = this.actions.reduce(
      (prev, curr) => {
        const type = curr.action.trpc;

        if (!type) return prev;

        prev[type].push(curr);

        return prev;
      },
      { mutation: [], query: [], subscription: [] } as GroupTrpcAction
    );

    this.$trpcMutations = null;
    this.$trpcQueries = null;
  }

  public get trpcMutations() {
    if (this.$trpcMutations) return this.$trpcMutations;

    this.$trpcMutations = this.trpcActions.mutation.reduce((prev, curr) => {
      // @ts-expect-error no-defined-name-props
      // eslint-disable-next-line no-param-reassign
      prev[curr.actionName] = getTrpcInput(this.procedure, curr).mutation(
        ({ input }) => trpcHandler(curr, input)
      );

      return prev;
    }, {} as TrpcMutationCallRecord);

    return this.$trpcMutations;
  }

  public get trpcQueries() {
    if (this.$trpcQueries) return this.$trpcQueries;

    this.$trpcQueries = this.trpcActions.query.reduce((prev, curr) => {
      // @ts-expect-error no-defined-name-props
      // eslint-disable-next-line no-param-reassign
      prev[curr.actionName] = getTrpcInput(this.procedure, curr).query(
        ({ input }) => trpcHandler(curr, input)
      );

      return prev;
    }, {} as TrpcQueryCallRecord);

    return this.$trpcQueries;
  }

  public get procedures() {
    return {
      ...this.trpcMutations,
      ...this.trpcQueries,
    };
  }
}
