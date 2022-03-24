import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import prisma from "../database/prismaClient";
import { Command } from "../interfaces/Command";

export const pros: Command = {
  data: new SlashCommandBuilder()
    .setName("pros")
    .setDescription("Find a pro's crosshair!"),
  run: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const PRO_USER = 69;

    const crosshairs = await prisma.user.findFirst({
      where: {
        id: PRO_USER,
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

    crosshairItems.sort();

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select-pros")
        .setPlaceholder("Select a crosshair")
        .addOptions(crosshairItems)
    );

    await interaction.editReply({
      components: [row],
    });
  },
};
