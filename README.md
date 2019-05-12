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
  ```html
    <cal show="{{show}}" limit="{{limit}}" actColor="{{actColor}}" range="{{range}}" onSelectEvent="onSelectEvent"></cal>
  ```

 ### 支持功能
 * 支持日期单选，也支持日期范围选择
 * 支持自定义最小选中天数
 * 支持自定义日历的主题色

### 参数说明
 参数名 | 参数类型 | 默认值 | 说明 |
------------ | ------------- | ---- | ---|
show | Boolean | false | 是否显示 |
limit | Number | 1 | 如果是范围选择最小间隔天数 |
actColor | String | #51BF85 | 主题色 |
onSelectEvent | Event | 无 | 选中后的回调函数，包含选中的日期 |

### DEMO
![支付宝扫码预览](https://mobilecodec.alipay.com/show.htm?code=s6x09027oqrlqyl5bk7jq29)
