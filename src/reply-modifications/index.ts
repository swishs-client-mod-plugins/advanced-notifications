import Patcher from '@patcher';
import SettingsComponent, {
  IncomingValues,
  OutgoingValues,
} from './Settings';

import { create } from '@apis/settings';

const Settings = create('reply-modifications');

import type { MessageJSON } from 'discord-types/general';
import type { FluxDispatcher } from 'discord-types/other';
import type { UserStore as UserStoreType } from 'discord-types/stores';

const Dispatcher: FluxDispatcher = Webpack.common.Dispatcher;
const PendingReplies = Webpack.getByProps('createPendingReply');
const UserStore: UserStoreType = Webpack.getModule(m => m.getName?.() === 'UserStore');

namespace Replies {
  let patches: ((() => void) | void)[] = [];
  export function start() {
    type Args = [{ message: MessageJSON, type: string; }];
    patches.push(Patcher.before(Dispatcher, '_dispatch', ([{ message, type }]: Args) => {
      if (type !== 'MESSAGE_CREATE') return;

      const currentUser = UserStore.getCurrentUser();
      if (!currentUser || !Array.isArray(message.mentions) || !message.referenced_message) return;

      const mentionIndex = message.mentions.findIndex(a => a.id === currentUser.id);

      switch (Settings.get('incoming', IncomingValues.DEFAULT)) {
        case IncomingValues.FORCE:
          if (message.referenced_message.author.id === currentUser.id && mentionIndex === -1)
            message.mentions.push(message.referenced_message.author);
          break;
        case IncomingValues.SUPPRESS:
          if (message.referenced_message.author.id === currentUser.id && mentionIndex > -1)
            message.mentions.splice(mentionIndex, 1);
      }
    }));

    patches.push(Patcher.before(PendingReplies, 'createPendingReply', ([args]) => {
      switch (Settings.get('outgoing', OutgoingValues.DEFAULT)) {
        case OutgoingValues.REMEMBER:
          args.shouldMention = Settings.get('lastMention', true);
          break;
        case OutgoingValues.SUPPRESS:
          args.shouldMention = false;
      }
    }));

    patches.push(Patcher.before(PendingReplies, 'setPendingReplyShouldMention', ([, shouldMention]) => {
      Settings.set('lastMention', shouldMention);
    }));
  };

  export function stop() {
    patches.forEach(unpatch => unpatch && unpatch());
  };

  export const settings = SettingsComponent;
}

// Because I'm evaling the code I can't directly use ESM exports to export this.
// And the alternative with ESBuild is to wrap it in a function that doesn't return anything.
// So to get past this I just set the export object to window and intercept it in the start function.
window.adn.temp = Replies;
