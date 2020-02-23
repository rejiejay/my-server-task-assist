import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAssisWhy {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 定义: 大目标关联唯一标识
     * 作用: 关联大目标
     */
    @Column({ type: 'tinytext' })
    targetId: string;

    // 理由 内容
    @Column({ type: 'text' })
    content: string;

    // 置顶 理由
    @Column({ type: 'bigint', nullable: true })
    stickyTimestamp: number;

    // SQL时间戳
    @Column({ type: 'bigint' })
    sqlTimestamp: number;
}