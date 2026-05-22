import { InjectionToken } from '@angular/core';
import { IPostService } from './post-service.interface';

export const POST_SERVICE = new InjectionToken<IPostService>('POST_SERVICE');
