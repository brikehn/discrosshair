import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import prisma from "../database/prismaClient";
import { Command } from "../interfaces/Command";

export const remove: Command = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Select a crosshair to remove!"),
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
        value: crosshair.name,
      })
    );

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select-remove")
        .setPlaceholder("Select a crosshair")
        .addOptions(crosshairItems)
    );

    await interaction.editReply({
      components: [row],
    });
  },
};
