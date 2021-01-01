import { Op } from 'scbl-lib/db/sequelize';
import { Ban, BanList, Organisation, SteamUser } from 'scbl-lib/db/models';

export default {
  Query: {
    organisations: () => {
      return Organisation.findAll();
    },
    banLists: () => {
      return BanList.findAll();
    },
    bans: (parent, filter) => {
      return Ban.paginate({
        order: [[filter.orderBy || 'created', filter.orderDirection || 'DESC']],
        first: filter.first,
        after: filter.after,
        last: filter.last,
        before: filter.before
      });
    },
    steamUsers: (parent, filter) => {
      return SteamUser.paginate({
        order: [[filter.orderBy || 'id', filter.orderDirection || 'DESC']],
        first: filter.first,
        after: filter.after,
        last: filter.last,
        before: filter.before,
        where:
          filter.orderBy === 'reputationRank' ? { reputationRank: { [Op.ne]: null } } : undefined
      });
    },
    steamUser: async (parent, filter) => {
      const user = await SteamUser.findByPk(filter.id);

      if (user) {
        user.lastViewed = Date.now();
        await user.save();
      }

      return user;
    },
    loggedInSteamUser: async (parent, filter, context) => {
      return context.user ? SteamUser.findByPk(context.user.id) : null;
    }
  }
};
