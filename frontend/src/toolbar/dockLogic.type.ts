// Auto-generated with kea-typegen v0.0.12. DO NOT EDIT!

export interface dockLogicType<ToolbarMode,  AnimationState> {
    actionCreators: {
        button: () => ({
            type: "button (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        dock: () => ({
            type: "dock (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        hideButton: () => ({
            type: "hide button (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        update: () => ({
            type: "update (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        buttonAnimated: () => ({
            type: "button animated (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        buttonFaded: () => ({
            type: "button faded (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        dockAnimated: () => ({
            type: "dock animated (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        dockFaded: () => ({
            type: "dock faded (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        hideButtonAnimated: () => ({
            type: "hide button animated (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        setMode: (mode: ToolbarMode, update?: boolean) => ({
            type: "set mode (frontend.src.toolbar.dockLogic)";
            payload: { mode: ToolbarMode; update: boolean; windowWidth: number; windowHeight: number; };
        });
    };
    actions: {
        button: () => ({
            type: "button (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        dock: () => ({
            type: "dock (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        hideButton: () => ({
            type: "hide button (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        update: () => ({
            type: "update (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        buttonAnimated: () => ({
            type: "button animated (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        buttonFaded: () => ({
            type: "button faded (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        dockAnimated: () => ({
            type: "dock animated (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        dockFaded: () => ({
            type: "dock faded (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        hideButtonAnimated: () => ({
            type: "hide button animated (frontend.src.toolbar.dockLogic)";
            payload: {
                value: boolean;
            };
        });
        setMode: (mode: ToolbarMode, update?: boolean) => ({
            type: "set mode (frontend.src.toolbar.dockLogic)";
            payload: { mode: ToolbarMode; update: boolean; windowWidth: number; windowHeight: number; };
        });
    };
    reducer: (state: any, action: () => any, fullState: any) => {
        mode: ToolbarMode;
        lastMode: ToolbarMode;
        dockStatus: AnimationState;
        buttonStatus: AnimationState;
    };
    reducers: {
        mode: (state: ToolbarMode, action: any, fullState: any) => ToolbarMode;
        lastMode: (state: ToolbarMode, action: any, fullState: any) => ToolbarMode;
        dockStatus: (state: AnimationState, action: any, fullState: any) => AnimationState;
        buttonStatus: (state: AnimationState, action: any, fullState: any) => AnimationState;
    };
    selector: (state: any) => {
        mode: ToolbarMode;
        lastMode: ToolbarMode;
        dockStatus: AnimationState;
        buttonStatus: AnimationState;
    };
    selectors: {
        mode: (state: any, props: any) => ToolbarMode;
        lastMode: (state: any, props: any) => ToolbarMode;
        dockStatus: (state: any, props: any) => AnimationState;
        buttonStatus: (state: any, props: any) => AnimationState;
        isAnimating: (state: any, props: any) => boolean;
        sidebarWidth: (state: any, props: any) => number;
        padding: (state: any, props: any) => number;
        bodyWidth: (state: any, props: any) => number;
        zoom: (state: any, props: any) => number;
        domZoom: (state: any, props: any) => number;
        domPadding: (state: any, props: any) => number;
        dockTopMargin: (state: any, props: any) => any;
    };
    values: {
        mode: ToolbarMode;
        lastMode: ToolbarMode;
        dockStatus: AnimationState;
        buttonStatus: AnimationState;
        isAnimating: boolean;
        sidebarWidth: number;
        padding: number;
        bodyWidth: number;
        zoom: number;
        domZoom: number;
        domPadding: number;
        dockTopMargin: any;
    };
    __selectorTypeHelp: {
        isAnimating: (arg1: AnimationState, arg2: AnimationState) => boolean;
        padding: (arg1: any) => number;
        bodyWidth: (arg1: any, arg2: number, arg3: number) => number;
        zoom: (arg1: number, arg2: any) => number;
        domZoom: (arg1: number, arg2: ToolbarMode) => number;
        domPadding: (arg1: number, arg2: ToolbarMode) => number;
        dockTopMargin: (arg1: any) => any;
    };
}