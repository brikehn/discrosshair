import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import prisma from "../database/prismaClient";
import { Command } from "../interfaces/Command";

export const list: Command = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List all your crosshairs!"),
  run: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const discordId = user.id;

    const crosshairs = await prisma.user.findUnique({
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

    const crosshairList = crosshairs.Crosshair.map(
      ({ name, crosshairString }) => ({
        name,
        value: crosshairString,
      })
    );

    const message = new MessageEmbed()
      .setTitle("Crosshairs")
      .setDescription("List of your crosshairs")
      .setColor("PURPLE")
      .addFields(crosshairList);

    await interaction.editReply({ embeds: [message] });
  },
};
