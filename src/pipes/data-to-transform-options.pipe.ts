import {PipeTransform} from "@nestjs/common";
import {TransformOptionsType} from "../types";
import {Class} from "utility-types";

export class DataToTransformOptionsPipe<T extends object> implements PipeTransform<string | string[], TransformOptionsType<T>> {
    constructor(
        private readonly entity: Class<T>,
        private readonly fail: boolean
    ) {}

    transform(data: string | string[]): TransformOptionsType<T> {
        return {
            data,
            entity: this.entity,
            fail: this.fail
        }
    }
}