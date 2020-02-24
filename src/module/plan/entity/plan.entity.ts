import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAssisPlan {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 定义: 大目标关联唯一标识
     * 作用: 关联大目标
     */
    @Column({ type: 'tinytext' })
    targetId: string;

    // 方案 
    @Column({ type: 'text', nullable: true })
    program: string;

    // 依据 
    @Column({ type: 'text', nullable: true })
    according: string;

    // SQL时间戳
    @Column({ type: 'bigint' })
    sqlTimestamp: number;
}