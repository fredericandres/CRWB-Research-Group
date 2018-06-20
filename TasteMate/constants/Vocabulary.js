import {_getLanguageCode, VocabEnum} from "./Constants";
import LocalizedStrings from 'react-native-localization';
import moment from "moment";
import "moment/locale/ja";
import "moment/locale/fr";

moment.locale(_getLanguageCode());

export const allVocabulary = [
    {key: '0', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'basil'},ja: {name: 'バジル'},fr: {name: 'basilic'}})},
    {key: '1', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'bitter'},ja: {name: '苦い'},fr: {name: 'amer'}})},
    {key: '2', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'bitter-sweet'},ja: {name: 'ほろ苦い'},fr: {name: 'doux-amer'}})},
    {key: '3', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'burnt'},ja: {name: '燃え尽きる'},fr: {name: 'brûlé'}})},
    {key: '4', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'cinnamon'},ja: {name: 'シナモン'},fr: {name: 'cannelle'}})},
    {key: '5', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'coriander'},ja: {name: 'コリアンダー'},fr: {name: 'coriandre'}})},
    {key: '6', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'cumin'},ja: {name: 'クミン'},fr: {name: 'cumin'}})},
    {key: '7', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'dill'},ja: {name: 'ディル'},fr: {name: 'aneth'}})},
    {key: '8', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'fishy'},ja: {name: '魚のような'},fr: {name: 'de poisson'}})},
    {key: '9', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'floral'},ja: {name: '花'},fr: {name: 'floral'}})},
    {key: '10', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'fresh'},ja: {name: '新鮮な'},fr: {name: 'frais'}})},
    {key: '11', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'fruity'},ja: {name: 'フルーティー'},fr: {name: 'fruité'}})},
    {key: '12', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'garlic'},ja: {name: 'ニンニク'},fr: {name: 'ail'}})},
    {key: '13', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'gingery'},ja: {name: 'ギンギリ'},fr: {name: 'gout de gingembre'}})},
    {key: '14', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'lemon'},ja: {name: 'レモン'},fr: {name: 'citron'}})},
    {key: '15', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'nutmeg'},ja: {name: 'ナツメグ'},fr: {name: 'noix de muscade'}})},
    {key: '16', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'nutty'},ja: {name: 'ナッティ'},fr: {name: 'noisette'}})},
    {key: '17', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'oily'},ja: {name: '油性'},fr: {name: 'huileux'}})},
    {key: '18', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'oniony'},ja: {name: 'オニオン'},fr: {name: 'gout d’onion'}})},
    {key: '19', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'orange'},ja: {name: 'オレンジ'},fr: {name: 'orange'}})},
    {key: '20', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'paprika'},ja: {name: 'パプリカ'},fr: {name: 'paprika'}})},
    {key: '21', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'parsley'},ja: {name: 'パセリ'},fr: {name: 'persil'}})},
    {key: '22', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'pepper'},ja: {name: 'コショウ'},fr: {name: 'poivre'}})},
    {key: '23', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'rosemary'},ja: {name: 'ローズマリー'},fr: {name: 'rosmarin'}})},
    {key: '24', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'salty'},ja: {name: '塩辛い'},fr: {name: 'alé'}})},
    {key: '25', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'sour'},ja: {name: 'サワー'},fr: {name: 'acide'}})},
    {key: '26', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'spicy'},ja: {name: 'スパイシー'},fr: {name: 'epicé'}})},
    {key: '27', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'sweet'},ja: {name: '甘い'},fr: {name: 'doux'}})},
    {key: '28', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'umami'},ja: {name: 'うま味'},fr: {name: 'umami'}})},
    {key: '29', type: VocabEnum.TASTE, value: new LocalizedStrings({en: {name: 'vanilla'},ja: {name: 'バニラ'},fr: {name: 'vanille'}})},
];