export declare class Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(id: string, title: string, content: string);
    update(title?: string, content?: string): void;
}
