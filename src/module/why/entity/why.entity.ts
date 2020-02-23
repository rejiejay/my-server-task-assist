import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAssisWhy {
    @PrimaryGeneratedColumn()
    id: number;

    // 理由 内容
    @Column({ type: 'text', nullable: true })
    content: string;

    // 置顶 理由
    @Column({ type: 'bigint', nullable: true })
    stickyTimestamp: number;

    // SQL时间戳
    @Column({ type: 'bigint' })
    sqlTimestamp: number;
}