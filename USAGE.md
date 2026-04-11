# FuickJS 功能使用指南

本文档记录了 FuickJS 框架中新增功能的用法，包括组件注册检查、事件总线、单子组件校验以及 Native 服务调用约定。

## 1. 组件注册检查 (Widget Registration Check)

JS 端现在可以检查某个 Flutter 组件是否已在 Native 端注册。这对于根据环境动态降级或调整 UI 非常有用。

### JS 端用法

使用 `UIService.isWidgetRegistered(type)` 方法：

```typescript
import { UIService } from 'fuick-js-framework';

// 检查 'Container' 组件是否注册
const hasContainer = UIService.isWidgetRegistered('Container');

if (hasContainer) {
    // 使用 Container
} else {
    // 使用备选组件或不渲染
}

// 检查自定义组件
const hasMyWidget = UIService.isWidgetRegistered('MyCustomWidget');
```

### Flutter 端实现原理

Flutter 端的 `UIService` 实现了 `isWidgetRegistered` 方法，它会查询 `WidgetFactory` 中的 `_parsers` 映射表。

## 2. 原生事件 (NativeEvent)

NativeEvent 提供了 JS 与 Flutter 之间的事件通信机制。

### JS 端用法

```typescript
import { NativeEvent } from 'fuick-js-framework';

// 1. 监听事件 (来自 Flutter 或 JS 内部)
// 方式一：保存回调函数引用
const handler = (data) => {
    console.log('Received event:', data);
};
NativeEvent.on('custom_event', handler);

// 方式二：使用返回的取消函数 (推荐)
const off = NativeEvent.on('custom_event', (data) => {
    console.log('Received:', data);
});

// 2. 发送事件 (发送给 Flutter 和 JS 内部)
NativeEvent.emit('custom_event', { message: 'Hello from JS' });

// 3. 移除监听
// 方式一：使用 callback
NativeEvent.off('custom_event', handler);
// 方式二：调用返回的取消函数
off();
```

### Flutter 端用法

```dart
// 获取 NativeEventService 实例
// 通过 controller 获取
final nativeEvent = controller.getService<NativeEventService>();

// 1. 监听事件 (来自 JS 或 Flutter 内部)
// 方式一：保存回调引用
void handler(data) {
    print('Flutter received: $data');
}
nativeEvent?.on('custom_event', handler);

// 方式二：使用返回的取消函数 (推荐)
final dispose = nativeEvent?.on('custom_event', (data) {
    print('Flutter received: $data');
});

// 2. 发送事件 (发送给 JS)
nativeEvent?.emit('custom_event', {'message': 'Hello from Flutter'});

// 3. 移除监听
// 方式一：使用 callback
nativeEvent?.off('custom_event', handler);
// 方式二：调用返回的取消函数
dispose?.call();
```

## 4. Native 服务调用约定 (Service Call Convention)

JS 调用 Native 服务必须遵循 `ServiceName.MethodName` 的命名约定。

### 格式
`dartCallNative('ServiceName.MethodName', args)`

### 示例

*   **UI 服务**: `UI.renderUI`, `UI.isWidgetRegistered`
*   **导航服务**: `Navigator.push`, `Navigator.pop`
*   **网络服务**: `Network.fetch`
*   **定时器服务**: `Timer.setTimeout`
*   **控制台服务**: `Console.log`
*   **原生事件**: `NativeEvent.emit`

### 新增 Native 服务步骤

1.  在 Flutter 端继承 `BaseFuickService`。
2.  重写 `name` getter 返回服务名称（如 `MyService`）。
3.  在构造函数中使用 `registerMethod` 注册方法（如 `myMethod`）。
4.  在 `NativeServiceManager` 中注册该服务。
5.  JS 端即可通过 `dartCallNative('MyService.myMethod', ...)` 调用。
