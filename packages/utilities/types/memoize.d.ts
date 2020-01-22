/**
 *  Test utility for providing a custom weakmap.
 *
 * @internal
 * */
export declare function setMemoizeWeakMap(weakMap: any): void;
/**
 * Reset memoizations.
 */
export declare function resetMemoizations(): void;
/**
 * Memoize decorator to be used on class methods. WARNING: the `this` reference
 * will be inaccessible within a memoized method, given that a cached method's `this`
 * would not be instance-specific.
 *
 * @public
 */
export declare function memoize<T extends Function>(target: any, key: string, descriptor: TypedPropertyDescriptor<T>): {
    configurable: boolean;
    get(): T;
};
/**
 * Memoizes a function; when you pass in the same parameters multiple times, it returns a cached result.
 * Be careful when passing in objects, you need to pass in the same INSTANCE for caching to work. Otherwise
 * it will grow the cache unnecessarily. Also avoid using default values that evaluate functions; passing in
 * undefined for a value and relying on a default function will execute it the first time, but will not
 * re-evaluate subsequent times which may have been unexpected.
 *
 * By default, the cache will reset after 100 permutations, to avoid abuse cases where the function is
 * unintendedly called with unique objects. Without a reset, the cache could grow infinitely, so we safeguard
 * by resetting. To override this behavior, pass a value of 0 to the maxCacheSize parameter.
 *
 * @public
 * @param cb - The function to memoize.
 * @param maxCacheSize - Max results to cache. If the cache exceeds this value, it will reset on the next call.
 * @returns A memoized version of the function.
 */
export declare function memoizeFunction<T extends (...args: any[]) => RET_TYPE, RET_TYPE>(cb: T, maxCacheSize?: number): T;
//# sourceMappingURL=memoize.d.ts.map