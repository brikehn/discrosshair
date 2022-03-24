import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { CommandList } from "../commands/_CommandList";

export const onReady = async (client: Client) => {
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN as string);

  const commandData: {
    name: string;
    description?: string;
    type?: number;
    options?: APIApplicationCommandOption[];
  }[] = [];

  CommandList.forEach((command) =>
    commandData.push(
      command.data.toJSON() as {
        name: string;
        description?: string;
        type?: number;
        options?: APIApplicationCommandOption[];
      }
    )
  );

  await rest.put(
    Routes.applicationGuildCommands(
      client.user?.id || "missing id",
      process.env.GUILD_ID as string
    ),
    { body: commandData }
  );

  console.log("Discord ready!");
};
