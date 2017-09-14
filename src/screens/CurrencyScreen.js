import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View } from 'react-native';
import { C, STYLE } from '../config';
import { CurrencyContent, ExchangeListItem } from '../components';
import { ServiceCurrencies } from '../services';
import { snapshotsAction } from '../actions';
import styles from './CurrencyScreen.style';

const DEFAULT_TIMELINE = C.TIMELINES[0];

class CurrencyScreen extends Component {
  static navigationOptions({ navigation: { state } }) {
    const { currency = {} } = state.params || {};

    return {
      title: currency.name,
      // @TODO: Release 0.4.0 (Alarms)
      // headerRight:  con="alert" onPress={() => navigate('Currencies')} />,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      history: undefined,
      prefetch: false,
      refreshing: false,
      timeline: DEFAULT_TIMELINE,
    };
    this._fetch = this._fetch.bind(this);
    this._onPressTimeline = this._onPressTimeline.bind(this);
  }

  componentWillMount() {
    this._fetch();
  }

  componentWillReceiveProps() {
    this.setState({ history: undefined, timeline: DEFAULT_TIMELINE });
  }

  async _fetch() {
    const { currency, snapshots } = this.props;

    this.setState({ history: undefined, refreshing: true, timeline: DEFAULT_TIMELINE });
    const snapshot = await ServiceCurrencies.fetch(currency.symbol);
    const history = await ServiceCurrencies.history(currency.symbol);

    snapshots({ ...snapshot, history }, currency.symbol);
    this.setState({ prefetch: true, refreshing: false });
  }

  async _onPressTimeline(timeline) {
    const { currency: { symbol } } = this.props;

    this.setState({ history: [], timeline });
    const history = await ServiceCurrencies.history(symbol, timeline);
    this.setState({ history });
  }

  render() {
    const { _onPressTimeline } = this;
    const { currency, snapshot } = this.props;
    const { prefetch, refreshing, timeline, history = snapshot.history || [] } = this.state;
    const { exchanges = [] } = snapshot;

    return (
      <View style={STYLE.SCREEN}>
        <CurrencyContent
          currency={currency}
          history={history}
          onChange={_onPressTimeline}
          snapshot={snapshot}
          timeline={timeline}
        />
        <ScrollView style={STYLE.LAYOUT_SECONDARY}>
          {
            exchanges.map(item => <ExchangeListItem key={`${item.MARKET}${item.PRICE}`} exchanger={item} />)
          }
        </ScrollView>
      </View>
    );
  }
}

CurrencyScreen.propTypes = {
  currency: C.SHAPE.CURRENCY,
  snapshot: C.SHAPE.SNAPSHOT,
};

CurrencyScreen.defaultProps = {
  currency: {},
  snapshot: {},
};

const mapStateToProps = ({ snapshots = {} }, props) => {
  const { currency = {} } = props.navigation.state.params;
  const snapshot = snapshots[currency.symbol] || {};

  return { currency, snapshot };
};

const mapDispatchToProps = dispatch => ({
  snapshots: (currency, symbol) => dispatch(snapshotsAction(currency, symbol)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyScreen);
