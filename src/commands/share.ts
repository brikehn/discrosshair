import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import prisma from "../database/prismaClient";
import { Command } from "../interfaces/Command";

export const share: Command = {
  data: new SlashCommandBuilder()
    .setName("share")
    .setDescription("Select a crosshair to share!"),
  run: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const discordId = user.id;

    const crosshairs = await prisma.user.findFirst({
      where: {
        discordId,
      },
      select: {
        Crosshair: {
          select: {
            name: true,
            crosshairString: true,
          },
        },
      },
    });

    if (!crosshairs?.Crosshair.length) {
      await interaction.editReply({
        content:
          "Could not find any crosshairs. Trying adding a crosshair first.",
      });
      return;
    }

    const crosshairItems: MessageSelectOptionData[] = crosshairs?.Crosshair.map(
      (crosshair) => ({
        label: crosshair.name,
        value: crosshair.crosshairString,
      })
    );

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select-share")
        .setPlaceholder("Select a crosshair")
        .addOptions(crosshairItems)
    );

    await interaction.editReply({
      components: [row],
    });

    if (interaction.isSelectMenu()) {
      if (interaction.customId === "select-share") {
        const { user } = interaction;
        const shareEmbed = new MessageEmbed()
          .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL(),
          })
          .setTitle("My Crosshair")
          .setColor("BLUE")
          .setDescription(interaction.values[0]);

        await interaction.reply({
          embeds: [shareEmbed],
          components: [],
        });
      }
    }
  },
};
