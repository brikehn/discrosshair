import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageEmbed,
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

    const crosshairItems: MessageSelectOptionData[] = crosshairs.Crosshair.map(
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

    if (interaction.isSelectMenu()) {
      if (interaction.customId === "select-remove") {
        await prisma.crosshair.deleteMany({
          where: {
            name: {
              equals: interaction.values[0],
            },
            AND: {
              User: {
                discordId: {
                  equals: interaction.user.id,
                },
              },
            },
          },
        });

        const deleteEmbed = new MessageEmbed()
          .setTitle("Deleted Crosshair")
          .setColor("RED")
          .setDescription(interaction.values[0]);

        await interaction.update({
          embeds: [deleteEmbed],
          components: [],
        });
      }
    }
  },
};
