import 'package:flutter/material.dart';

typedef ControllerCallback<T> = void Function(T controller);

class FuickPageView extends StatefulWidget {
  final String? refId;
  final int initialPage;
  final Axis scrollDirection;
  final ValueChanged<int>? onPageChanged;
  final List<Widget> children;
  final ControllerCallback<PageController>? onControllerCreated;
  final VoidCallback? onDispose;

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

class _FuickPageViewState extends State<FuickPageView> {
  late PageController _controller;

  @override
  void initState() {
    super.initState();
    _controller = PageController(initialPage: widget.initialPage);
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void dispose() {
    widget.onDispose?.call();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PageView(
      controller: _controller,
      scrollDirection: widget.scrollDirection,
      onPageChanged: widget.onPageChanged,
      children: widget.children,
    );
  }
}

typedef ScrollWidgetBuilder =
    Widget Function(BuildContext context, ScrollController controller);

class FuickScrollable extends StatefulWidget {
  final String? refId;
  final ScrollWidgetBuilder builder;
  final ControllerCallback<ScrollController>? onControllerCreated;
  final VoidCallback? onDispose;

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

class _FuickScrollableState extends State<FuickScrollable> {
  late ScrollController _controller;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
    widget.onControllerCreated?.call(_controller);
  }

  @override
  void dispose() {
    widget.onDispose?.call();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return widget.builder(context, _controller);
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
      _loading = true;
      (widget.dslOrFuture as Future).then((value) {
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
    if (_loading) {
      return const SizedBox(
        height: 50,
        child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
      );
    }
    print('wine dsl $_dsl');
    if (_dsl == null) return const SizedBox.shrink();
    return widget.builder(context, _dsl);
  }
}
