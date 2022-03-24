import { Interaction, MessageEmbed } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import prisma from "../database/prismaClient";

export const onInteraction = async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    for (const Command of CommandList) {
      if (interaction.commandName === Command.data.name) {
        await Command.run(interaction);
        break;
      }
    }
  }
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
      });
    }

    if (interaction.customId === "select-pros") {
      const proEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setDescription(interaction.values[0]);

      await interaction.update({
        embeds: [proEmbed],
        components: [],
      });
    }
  }
};
