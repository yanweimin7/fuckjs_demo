import 'package:flutter/material.dart';
import '../service/fuick_command_bus.dart';
import 'widget_utils.dart';
import '../utils/extensions.dart';
import '../container/fuick_page_view.dart'; // Import for FuickPageScope
import '../container/fuick_app_controller.dart'; // Import for FuickAppScope

typedef ControllerCallback<T> = void Function(T controller);

class FuickPageView extends StatefulWidget {
  final String? refId;
  final int initialPage;
  final Axis scrollDirection;
  final ValueChanged<int>? onPageChanged;
  final List<Widget> children;
  final ControllerCallback<PageController>? onControllerCreated;
  final ControllerCallback<PageController>? onDispose;

  const FuickPageView({
    super.key,
    this.refId,
    required this.initialPage,
    required this.scrollDirection,
    this.onPageChanged,
    required this.children,
    this.onControllerCreated,
    this.onDispose,
  });

  @override
  State<FuickPageView> createState() => _FuickPageViewState();
}

class _FuickPageViewState extends State<FuickPageView>
    with AutomaticKeepAliveClientMixin {
  late PageController _controller;
  FuickCommandBus? _commandBus;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _controller = PageController(initialPage: widget.initialPage);
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _commandBus = FuickAppScope.of(context)?.commandBus;
    _unregisterCommandListener(widget.refId);
    _registerCommandListener();
  }

  void _registerCommandListener() {
    if (widget.refId != null && _commandBus != null) {
      _commandBus!.addListener(widget.refId!, _onCommand);
    }
  }

  void _unregisterCommandListener(String? refId) {
    if (refId != null && _commandBus != null) {
      _commandBus!.removeListener(refId, _onCommand);
    }
  }

  void _onCommand(String method, dynamic args) {
    if (!mounted || !_controller.hasClients) return;

    if (method == 'animateToPage') {
      final page = asInt(args['page']);
      final duration = asIntOrNull(args['duration']) ?? 300;
      final curveName = args['curve'] as String? ?? 'easeInOut';
      final curve = WidgetUtils.curve(curveName);

      _controller.animateToPage(
        page,
        duration: Duration(milliseconds: duration),
        curve: curve,
      );
    } else if (method == 'jumpToPage' || method == 'setPageIndex') {
      final page = asInt(args['page'] ?? args['index']);
      _controller.jumpToPage(page);
    }
  }

  @override
  void didUpdateWidget(FuickPageView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.refId != oldWidget.refId) {
      _unregisterCommandListener(oldWidget.refId);
      _registerCommandListener();

      if (oldWidget.refId != null) {
        oldWidget.onDispose?.call(_controller);
      }
      if (widget.refId != null) {
        widget.onControllerCreated?.call(_controller);
      }
    }
  }

  @override
  void dispose() {
    _unregisterCommandListener(widget.refId);
    widget.onDispose?.call(_controller);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return PageView(
      controller: _controller,
      scrollDirection: widget.scrollDirection,
      onPageChanged: widget.onPageChanged,
      children: widget.children,
    );
  }
}

typedef ScrollWidgetBuilder = Widget Function(
    BuildContext context, ScrollController controller);

class FuickScrollable extends StatefulWidget {
  final String? refId;
  final ScrollWidgetBuilder builder;
  final ControllerCallback<ScrollController>? onControllerCreated;
  final ControllerCallback<ScrollController>? onDispose;

  const FuickScrollable({
    super.key,
    this.refId,
    required this.builder,
    this.onControllerCreated,
    this.onDispose,
  });

  @override
  State<FuickScrollable> createState() => _FuickScrollableState();
}

class _FuickScrollableState extends State<FuickScrollable>
    with AutomaticKeepAliveClientMixin {
  late ScrollController _controller;
  FuickCommandBus? _commandBus;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _commandBus = FuickAppScope.of(context)?.commandBus;
    _unregisterCommandListener(widget.refId);
    _registerCommandListener();
  }

  void _registerCommandListener() {
    if (widget.refId != null && _commandBus != null) {
      _commandBus!.addListener(widget.refId!, _onCommand);
    }
  }

  void _unregisterCommandListener(String? refId) {
    if (refId != null && _commandBus != null) {
      _commandBus!.removeListener(refId, _onCommand);
    }
  }

  void _onCommand(String method, dynamic args) {
    if (!mounted || !_controller.hasClients) return;

    if (method == 'animateTo') {
      final offset = asDouble(args['offset']);
      final duration = asIntOrNull(args['duration']) ?? 300;
      final curveName = args['curve'] as String? ?? 'easeInOut';
      final curve = WidgetUtils.curve(curveName);

      _controller.animateTo(
        offset,
        duration: Duration(milliseconds: duration),
        curve: curve,
      );
    } else if (method == 'jumpTo') {
      final offset = asDouble(args['offset']);
      _controller.jumpTo(offset);
    }
  }

  @override
  void didUpdateWidget(FuickScrollable oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.refId != oldWidget.refId) {
      _unregisterCommandListener(oldWidget.refId);
      _registerCommandListener();

      if (oldWidget.refId != null) {
        oldWidget.onDispose?.call(_controller);
      }
      if (widget.refId != null) {
        widget.onControllerCreated?.call(_controller);
      }
    }
  }

  @override
  void dispose() {
    _unregisterCommandListener(widget.refId);
    widget.onDispose?.call(_controller);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.builder(context, _controller);
  }
}

class FuickTextField extends StatefulWidget {
  final String? refId;
  final String text;
  final String hintText;
  final String? border;
  final Map<String, dynamic> props;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final ControllerCallback<TextEditingController>? onControllerCreated;
  final ControllerCallback<TextEditingController>? onDispose;

  const FuickTextField({
    super.key,
    this.refId,
    required this.text,
    required this.hintText,
    this.border,
    required this.props,
    this.onChanged,
    this.onSubmitted,
    this.onControllerCreated,
    this.onDispose,
  });

  @override
  State<FuickTextField> createState() => _FuickTextFieldState();
}

class _FuickTextFieldState extends State<FuickTextField> {
  late TextEditingController _controller;
  FuickCommandBus? _commandBus;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.text);
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _commandBus = FuickAppScope.of(context)?.commandBus;
    _unregisterCommandListener(widget.refId);
    _registerCommandListener();
  }

  void _registerCommandListener() {
    if (widget.refId != null && _commandBus != null) {
      _commandBus!.addListener(widget.refId!, _onCommand);
    }
  }

  void _unregisterCommandListener(String? refId) {
    if (refId != null && _commandBus != null) {
      _commandBus!.removeListener(refId, _onCommand);
    }
  }

  void _onCommand(String method, dynamic args) {
    if (!mounted) return;

    if (method == 'setText') {
      final newText = (args is String ? args : args['text'] as String?) ?? '';
      _controller.text = newText;
    } else if (method == 'clear') {
      _controller.clear();
    }
  }

  @override
  void didUpdateWidget(FuickTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.text != oldWidget.text && widget.text != _controller.text) {
      _controller.text = widget.text;
    }

    if (widget.refId != oldWidget.refId) {
      _unregisterCommandListener(oldWidget.refId);
      _registerCommandListener();

      if (oldWidget.refId != null) {
        oldWidget.onDispose?.call(_controller);
      }
      if (widget.refId != null) {
        widget.onControllerCreated?.call(_controller);
      }
    }
  }

  @override
  void dispose() {
    _unregisterCommandListener(widget.refId);
    widget.onDispose?.call(_controller);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      decoration: InputDecoration(
        hintText: widget.hintText,
        border: widget.border == 'none' ? InputBorder.none : null,
      ),
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
    );
  }
}

class FuickItemDSLBuilder extends StatefulWidget {
  final dynamic dslOrFuture;
  final Widget Function(BuildContext context, dynamic dsl) builder;

  const FuickItemDSLBuilder({
    super.key,
    required this.dslOrFuture,
    required this.builder,
  });

  @override
  State<FuickItemDSLBuilder> createState() => _FuickItemDSLBuilderState();
}

class _FuickItemDSLBuilderState extends State<FuickItemDSLBuilder> {
  dynamic _dsl;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _resolveDSL();
  }

  @override
  void didUpdateWidget(FuickItemDSLBuilder oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.dslOrFuture != oldWidget.dslOrFuture) {
      _resolveDSL();
    }
  }

  void _resolveDSL() {
    if (widget.dslOrFuture is Future) {
      final future = widget.dslOrFuture as Future;
      // If we already have a DSL, don't set loading to true to avoid flickering
      if (_dsl == null) {
        _loading = true;
      }
      future.then((value) {
        if (mounted) {
          setState(() {
            _dsl = value;
            _loading = false;
          });
        }
      });
    } else {
      _dsl = widget.dslOrFuture;
      _loading = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Only show loading if we don't have any DSL to show
    if (_loading && _dsl == null) {
      return const SizedBox(
        height: 80,
        child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
      );
    }
    if (_dsl == null) return const SizedBox.shrink();
    return widget.builder(context, _dsl);
  }
}
