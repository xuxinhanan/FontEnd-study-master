> MongoDB 是一个基于文档数据库。它将数据存储在文档中，文档是字段值配对的数据结构。

### 基本概念

1. 数据库database：多个集合构成一个数据库（一般一个项目使用一个数据库）

   ![image-20221013194643757](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221013194643757.png)

2. 集合collection：多个文档构成一个集合（例如一个博客集合是由多个帖子组成）

3. 文档document：类似于 JSON 对象

   ![image-20221013202115614](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221013202115614.png)

4. 字段filed：类似于 JSON对象的各个键





### Mongoose库

Mongoose 是一个 Object Data Modeling (ODM) 库用于连接 MongoDB 和 Node.js，是 MongoDB更高层级的抽象。

![image-20221013211625764](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221013211625764.png)

+ **Mongoose schema**：通过描述数据结构、默认值和验证数据等为数据建模

+ **Mongoose model**：schema 的包装器, 为 CRUD 操作提供数据库接口

  

  

#### Createing操作

~~~js
// 方式一：save（实例方法）
const newTour = new Tour({})
newTour.save()

// 方式二：create（构造函数方法）
const newTour = await Tour.create(req.body);
~~~



#### Reading操作

~~~js
// 方式一：查询所有document
const tours = await Tour.find()

// 方式二：根据ID查询某个document （方便）
const tour = await Tour.findById(req.params.id)

// 方式三：根据ID查询某个document，需要过滤器（适合复杂操作）
Tour.findOne({ _id: req.params.id })
~~~





#### Updating操作

~~~js
const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true
})
~~~





#### Deleting操作

~~~js
await Tour.findByIdAndDelete(req.params.id)
~~~

在Restful API 中，删除操作不应返回任何数据给客户端。







### 接口高级功能

#### 支持过滤查询结果的接口

客户端访问url时其实是可以带上查询字符串的（如http://test.com/?key=value），而后端的接口逻辑中可以解析到这些查询字符串，并根据这些内容过滤出需要的数据返回给客户端。

~~~js
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
~~~



#### 支持排序查询结果的接口



~~~js
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }
~~~





#### 支持限制返回字段的接口

对于客户端来说，需要尽可能的接收更少的数据节省带宽，尤其是拥有大量数据的数据集。

因此仅允许用户请求某几个字段是非常有用的功能。



~~~js
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }
~~~





#### 支持分页获取数据的接口



~~~js
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
~~~





#### 路由别名中间件

例如，我们想要访问特定的数据，于是在查询字符串中附带特定的要求进行结果过滤。

然而，这个功能可以通过配置一个路由别名，通过中间件添加查询字符串完成。

~~~js
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
~~~



~~~js
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
~~~







#### 聚合操作

快速实现对查询的结果匹配、分组、排序等功能。



~~~js
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
~~~





#### 虚拟属性

在schema中定义的字段，但不会保存到数据库中以便节省空间。



~~~js
// durationWeeks字段不会保存在数据库中，但获取文档的时候也会获取到该虚拟属性
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
~~~



















