支付宝小程序日历选择组件

### 使用方式

* 在小程序项目中新建一个日历组件文件夹，例如：calendar
* 拷贝本项目下的 .acss ..axml .json .js 四个文件到文件夹
* 在需要使用的页面引入组件，例如：
  ```json
    "usingComponents": {
      "cal": "/calendar/calendar"
    }
  ```
* 最后在页面添加组件
  ```javascript
    <cal show="{{show}}" limit="{{limit}}" actColor="{{actColor}}" onSelectEvent="onSelectEvent"></cal>
  ```

