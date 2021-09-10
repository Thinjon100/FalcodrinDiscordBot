import CommandExecutionContext from "./CommandExecutionContext";

export default interface ICommandExecutor<T> {
    execute: (parameters: T, executionContext: CommandExecutionContext) => Promise<void>;
}