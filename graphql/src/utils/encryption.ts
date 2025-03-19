import { createHash } from 'crypto';

export const encrypt = (value) => {
    return createHash('sha256').update(value).digest('hex');
}