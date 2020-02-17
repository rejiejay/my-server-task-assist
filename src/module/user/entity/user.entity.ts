import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAssisUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 18 })
    name: string;

    @Column({ length: 18 })
    password: string;

    @Column({ length: 16 })
    token: string;

    @Column({type: 'bigint'})
    expired: number;
}