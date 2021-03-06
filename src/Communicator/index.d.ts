/**
 * @description 提供app间的通信能力
 */
declare class Communicator {
    private static ChannelRoot;
    on(channel: string, cb: Function): void;
    emit(channel: string, payload: any): void;
}
declare const _default: Communicator;
export default _default;
