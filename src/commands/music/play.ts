import {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { MenuId } from "../../types/MenuId";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "play",
  description: "find song for you chose",
  usage: "play",
  aliases: ["p"],
  category: "music",
  permission: [],
  run: async (client, message, args) => {
    if (!message.member?.voice.channel) {
      message.reply("bạn đang không ở trong kênh nhạc");
      return;
    }
    const musicName = args.join(" ");
    if (!musicName) {
      message.reply("bạn chưa nhập tên bài hát");
      return;
    }
    const video = await client.disTube?.search(musicName, {
      limit: 6,
      type: "video",
      safeSearch: true,
    });
    if (!video) {
      message.reply("không tìm thấy bài hát");
      return;
    }
    let description = ``;
    video.forEach((track, index) => {
      description += `${index}. ${track.name} thời lượng là ${
        track.formattedDuration
      } ${track.views ? `tổng lược xem ${track.views}` : ""} \n`;
    });

    const embed = new MessageEmbed()
      .setTitle("🎵 Chọn bài hát bạn muốn lưu ý")
      .setDescription(description)
      .setColor("#00ff00")
      .setFooter(
        "được làm bởi: ngủ ; người yêu cầu :" + message.author.username
      )
      .setTimestamp();
    const botMessage = await message.channel.send({
      embeds: [embed],
    });
    const collect = message.channel.createMessageCollector({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
    });
    let wasChoose = false;
    collect.on("collect", async (m) => {
      if (wasChoose) {
        if (botMessage.deletable) botMessage.delete();
        return;
      }
      if (m.content === "cancel") {
        m.channel.send("bạn đã hủy yêu cầu");
        return;
      }
      const index = parseInt(m.content);
      if (isNaN(index) || index < 0 || index >= video.length) {
        m.channel.send("bạn chọn sai bài hát");
        return;
      }
      const track = video[index];
      if (!m.member?.voice.channel) {
        m.reply("bạn đang không ở trong kênh nhạc");
        return;
      }
      if (m.channel.type !== "GUILD_TEXT") {
        m.reply("bạn phải ở trong kênh nhạc của mình");
        return;
      }
      client.disTube?.play(m.member?.voice.channel, track.url, {
        textChannel: m.channel,
        metadata: {
          channel: m.member?.voice.channel,
          textChannelId: m.channel.id,
          user: m.author.id,
        },
      });
      wasChoose = true;
      if (botMessage.deletable) botMessage.delete();
    });
  },
} as IMessageCommandHandlers;
