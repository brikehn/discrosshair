import { Command } from "../interfaces/Command";
import { add } from "./add";
import { list } from "./list";
import { pros } from "./pros";
import { remove } from "./remove";
import { share } from "./share";

export const CommandList: Command[] = [add, remove, list, share, pros];
