import { Component } from "./component";
import { extendComponent } from "./util";

export function createContext(value) {
    var context = {
        default: value
    }
    function Provider(p, c) {
        Component.call(this, p, c);
        this.c = [];
        this.p = this.p.bind(this);
        this.u = this.u.bind(this);
    }
    Provider.displayName = "Context.Provider"
    extendComponent(Provider, Component, {
        p(subscriber) {
            this.c.push(subscriber);
            return this.props.value;
        },
        u(subscriber) {
            this.c = this.c.filter(function (i) { return i !== subscriber; });
        },
        getChildContext() {
            var provider = {
                push: this.p,
                pop: this.u,
                context: context,
            };
            let providers = this.context.providers;
            if (providers) {
                providers.push(provider);
            } else {
                providers = [provider];
            }
            return { providers };
        },
        componentWillReceiveProps(nextProps) {
            if (this.props.value !== nextProps.value) {
                this.c.forEach(function (subscriber) {
                    subscriber(nextProps.value);
                });
            }
        },
        render() {
            return this.props.children && this.props.children[0];
        }
    });
    function Consumer(p, c) {
        Component.call(this, p, c);
        this.updateContext = this.updateContext.bind(this);
        if (c.providers) {
            for (var i = c.providers.length - 1; i >= 0; i--) {
                var provider = c.providers[i];
                if (provider.context === context) {
                    var value = provider.push(this.updateContext);
                    this.state = {
                        value: value,
                    };
                    this.popSubscriber = provider.pop;
                    break;
                }
            }
        }
    }
    Consumer.displayName = "Context.Consumer"
    extendComponent(Consumer, Component, {
        updateContext(val) {
            this.setState({ value: val });
        },
        componentWillUnmount() {
            if (this.popSubscriber) {
                this.popSubscriber(this.updateContext);
            }
        },
        render() {
            return this.props.children && this.props.children[0](this.state.value);
        }
    });
    context.Provider = Provider
    context.Consumer = Consumer
    return context;
}