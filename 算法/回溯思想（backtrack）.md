回溯的处理思想，有点类似枚举搜索。我们枚举所有的解，找到满足期望的解。为了有规律地枚举所有可能的解，避免遗漏和重复，我们把问题求解的过程分为多个阶段。每个阶段，我们都会面对一个岔路口，我们先随意选一条路走，当发现这条路走不通的时候（不符合期望的解），就回退到上一个岔路口，另选一种走法继续走。

因为《做选择 --> 撤销选择》的过程每次都一样，因此用递归来实现非常合适。

注：在递归中做选择不需要手动撤销，递归函数出栈即表示回退到上一个岔路口（例如二叉树遍历）；

如果是在递归外面做选择，那么需要手动撤销选择。











#### [491. 递增子序列](https://leetcode.cn/problems/increasing-subsequences/)


![image-20220509163644147.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f985028d729f4913bc54887c6fe4dad5~tplv-k3u1fbpfcp-watermark.image?)

结果去重的方式：将每个数组用 toString() 转换成字符串通过 Set 去重。

（注：要求子序列，因此不能打乱原数组，因此不能通过排序后在选择列表中去重）

```js
var findSubsequences = function(nums) {
    let result = [];
    let set = new Set();

    const backtrack = (path, index) => {
        if (path.length > 1) {
            let str = path.toString();
            if (!set.has(str)) {
                set.add(str);
                result.push(path.slice());
            }
        }
        for (let i = index; i < nums.length; i++) {
            let prev = path[path.length - 1];
            let curr = nums[i];
            if (index == 0 || curr >= prev) {
                path.push(nums[i]);
                backtrack([...path], i + 1);
                path.pop();
            }
        }
    }
    backtrack([], 0);
    return result;
};
```

#### [78. 子集](https://leetcode.cn/problems/subsets/)


![image-20220509164727292.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f12ea11b88974bc5a50a6fe5e3ee3ef9~tplv-k3u1fbpfcp-watermark.image?)

基础版通过选择列表去重。

```js
var subsets = function(nums) {
    const res = [];
    const dfs = (index, path) => {
        for (let i = index; i < nums.length; i++) {
            path.push(nums[i]);
            res.push([...path]);
            dfs(i + 1, [...path]);
            path.pop();
        }
    }
    dfs(0, []);
    return [[], ...res];
};
```

#### [90. 子集 II](https://leetcode.cn/problems/subsets-ii/)


![image-20220509164227783.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cabc8f8cefd1429da117f7e69c0d6a9f~tplv-k3u1fbpfcp-watermark.image?)

结果去重的方式：对选择列表去重。

```js
var subsetsWithDup = function(nums) {
    nums = nums.sort((a, b) => a - b);
    let result = [];
    const backtrack = (path, index) => {
        result.push(path.slice());
        if (index >= nums.length) return;
        
        for (let i = index; i < nums.length; i++) {
            if (i > index && nums[i] == nums[i - 1]) continue;
            path.push(nums[i]);
            backtrack([...path], i + 1);
            path.pop();
        }
    }
    backtrack([], 0);
    return result;
};
```

#### [46. 全排列](https://leetcode.cn/problems/permutations/)


![image-20220510101539743.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1192b9ba23b4f97ba322c94eabe0c70~tplv-k3u1fbpfcp-watermark.image?)

结果去重的方式——备忘录：对每个元素使用情况添加记录，如果使用过则跳过。

```js
var permute = function(nums) {
    const res = [];
    const memo = new Array(nums.length).fill(false);
    const dfs = (path) => {
        if (path.length === nums.length) return res.push(path.slice());
        for (let i = 0; i < nums.length; i++) {
            if (!memo[i]) {
                path.push(nums[i]);
                memo[i] = true;
                dfs([...path]);
                path.pop();
                memo[i] = false;
            }
        }
    }
    dfs([]);
    return res;
};
```

\




#### [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)


![image-20220509165821999.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4820410ce03b41fc9e4799181eb9e0a4~tplv-k3u1fbpfcp-watermark.image?)

结果去重方式：备忘录 + 选择列表去重。

```js
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    let result = [];
    let memo = new Array(candidates.length).fill(false);
    const traversal = (path, sum, index) => {
        if (sum > target) return;
        if (sum === target) {
            result.push(path.slice());
            return;
        }
        for (let i = index; i < candidates.length; i++) {
            if(candidates[i] === candidates[i - 1] && !memo[i - 1]) continue;
            path.push(candidates[i]);
            sum += candidates[i];
            memo[i] = true;
            traversal([...path], sum, i + 1);
            path.pop();
            sum -= candidates[i];
            memo[i] = false;
        }
    }
    traversal([], 0, 0);
    return result;
};
```