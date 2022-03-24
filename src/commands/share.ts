import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
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

    if (!crosshairs) return;

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
  },
};
