import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { ACCESS, IHistoryRecord, PLATFORM, RANKS, REGIONS, VERIFICATION_LEVEL } from '../utils/types';
import { Guild } from './Guild';
import { GuildBlacklist } from './GuildBlacklist';

import { Snowflake } from 'discord.js';
import { Lobby } from './Lobby';

@Table({
    timestamps: true,
    // scheme:
})
export class User extends Model<User> {
    @PrimaryKey
    @Column(DataType.STRING)
    public id: Snowflake; // discord snowflake

    @Column(DataType.UUID)
    public genome: string;

    @Column(DataType.ARRAY(DataType.JSONB))
    public genomeHistory: IHistoryRecord[];

    @Column(DataType.STRING(15))
    public nickname: string;

    @Column(DataType.ARRAY(DataType.JSONB))
    public nicknameHistory: IHistoryRecord[];

    @Column
    public inactive: boolean;

    @ForeignKey(() => Lobby)
    @Column
    public lobbyId: number;

    @BelongsTo(() => Lobby)
    public lobby: Lobby;

    @BelongsToMany(() => Guild, () => GuildBlacklist)
    public bannedAt: Guild[];

    @Column(DataType.INTEGER)
    public rank: RANKS;

    @Column(DataType.STRING)
    public region: REGIONS;

    @Default(0)
    @Column(DataType.INTEGER)
    public verificationLevel: VERIFICATION_LEVEL;

    @Column(DataType.INTEGER)
    public requiredVerification: VERIFICATION_LEVEL;

    @Column(DataType.JSONB)
    public platform: {
        PC: boolean,
        PS4: boolean,
        XBOX: boolean,
    };

    @Column(DataType.INTEGER)
    public access: ACCESS;

    @Column
    public karma: number;

    public pushGenome = (genome: string): void => {
        const old = this.getDataValue('genomeHistory') as IHistoryRecord[] || [];
        if (!old.some((r) => r.record === genome)) {
            this.setDataValue('genomeHistory', old.push({
                record: genome,
                timestamp: Date.now(),
            }));
        }
    }

    public pushNickname = (nickname: string): void => {
        const old = this.getDataValue('nicknameHistory') as IHistoryRecord[] || [];
        if (!old.some((r) => r.record === nickname)) {
            this.setDataValue('nicknameHistory', old.push({
                record: nickname,
                timestamp: Date.now(),
            }));
        }
    }
}
