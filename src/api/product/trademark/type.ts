export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

//已有品牌ts类型
export interface Trademark {
    id?: number
    tmName: string
    logoUrl: string
}

//包含全部品牌的ts类型
export type Records = Trademark[]

//获取已有全部品牌的全部ts

export interface TrademarkResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}
