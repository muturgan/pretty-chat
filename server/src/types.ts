export type messageType = {
    id: number,
    name: string,
    status: string,
    password: null,
    date: number,
    room: string,
    text: string,
    author_id: number,
};

export type userInfoType = {
    id: number,
    name: string,
    status: string,
};

export type mysqlConfigType = {
    readonly host: string,
    readonly user: string,
    readonly password: string,
    readonly database: string,
    readonly port: number,
};
