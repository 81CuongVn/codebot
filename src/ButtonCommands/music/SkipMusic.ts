import { IButtonCommandHandlers } from "../../types/buttonCommands";
import { ButtonId } from "../../types/ButtonId";
import { checkSameRoom, getVoiceChannel } from "../../utils/checkSameRoom";

export default {
    name: ButtonId.SkipMusic,
    run: async (client, interaction, args) => {
        const voiceChannel = getVoiceChannel(interaction, client);
        if (!voiceChannel) {
            interaction.update({
                content: "Bạn phải ở trong voice channel",
            });
            return;
        }
        if (!(await checkSameRoom(interaction, voiceChannel))) {
            interaction.update({
                content: "Bạn phải ở trong voice channel",
            });
            return;
        }
        if (!interaction.guild) {
            interaction.update({
                content: "Bot chỉ dùng trong server",
            });
            return;
        }
        const queue = client.player?.getQueue(interaction.guild);
        if (!queue) {
            interaction.update({
                content: "bot could not join your voice channel!",
            });
            return;
        }
        if (!queue.connection) {
            interaction.update({
                content: "bot could not join your voice channel!",
            });
            return;
        }
        queue.skip();
        interaction.update({
            content: "Bot đã tiếp tục",
        });
        return;
    }
} as IButtonCommandHandlers;