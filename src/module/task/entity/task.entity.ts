import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAssisTask {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 定义: 大目标关联唯一标识
     * 作用: 关联大目标
     */
    @Column({ type: 'tinytext' })
    targetId: string;

    // 标题
    @Column({ type: 'tinytext' })
    title: string;
    // 任务 内容
    @Column({ type: 'text', nullable: true })
    content: string;
    // 结论
    @Column({ type: 'longtext', nullable: true })
    conclusion: string;

    // 任务 衡量完成标准
    @Column({ type: 'tinytext', nullable: true })
    measure: string;
    // 任务 长时间跨度下意义
    @Column({ type: 'tinytext', nullable: true })
    span: string;
    // 任务 影响涉及到哪些方面
    @Column({ type: 'tinytext', nullable: true })
    aspects: string;
    // 任务 本质，为什么
    @Column({ type: 'tinytext', nullable: true })
    worth: string;
    // 任务 是否必须完成，何时
    @Column({ type: 'tinytext', nullable: true })
    estimate: string;

	/**
	 * 腾讯云对象存储的基本单元。命名格式为 <ObjectKey>由对象键（ObjectKey）、数据值（Value）、和对象元数据（Metadata）
	 * 对象键（ObjectKey）：对象键是对象在存储桶中的唯一标识。 数据值（Value）：即上传的对象大小。
	 * 对象元数据（Metadata）：是一组名称值对，您可以在上传对象时对其进行设置。 
	 * 
	 * @doc https://cloud.tencent.com/document/product/436/13324
	 */
    @Column({ type: 'tinytext', nullable: true })
    image: string;

    // 任务 推迟
    @Column({ type: 'bigint', nullable: true })
    putoffTimestamp: number;

    // 完成时间
    @Column({ type: 'bigint', nullable: true })
    completeTimestamp: number;

    // SQL时间戳
    @Column({ type: 'bigint' })
    sqlTimestamp: number;
}