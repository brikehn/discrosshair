import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import prisma from "../database/prismaClient";
import { Command } from "../interfaces/Command";

export const add: Command = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a new crosshair!")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of crosshair profile")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("crosshair")
        .setDescription("Crosshair settings to add")
        .setRequired(true)
    ),
  run: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const { user } = interaction;
    const discordId = user.id;
    const crosshairString = interaction.options.getString("crosshair", true);
    const name = interaction.options.getString("name", true);

    await prisma.crosshair.create({
      data: {
        name,
        crosshairString,
        User: {
          connectOrCreate: {
            where: {
              discordId,
            },
            create: {
              discordId,
            },
          },
        },
      },
    });

    const message = new MessageEmbed()
      .setTitle(name)
      .setDescription(crosshairString)
      .setColor("GREEN")
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [message] });
  },
};
