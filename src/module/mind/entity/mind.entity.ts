import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequireAssisMind {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    /**
     * 含义: id 别名 
     * 作用: 辅助关联
     */
    @Column({ type: 'tinytext' })
    alias: string;

    @Column({ type: 'bigint' })
    parentid: number;

    @Column({ type: 'tinytext' })
    title: string;

    @Column({ type: 'text' })
    content: string;

    // 时间跨度
    @Column({ type: 'text', nullable: true })
    timeSpan: string;

    // 角度
    @Column({ type: 'text', nullable: true })
    view: string;

    // 深度
    @Column({ type: 'text', nullable: true })
    nature: string;
}