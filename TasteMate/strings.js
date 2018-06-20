import LocalizedStrings from 'react-native-localization';
import {_getLanguageCode} from './constants/Constants';
import moment from "moment";
import "moment/locale/ja";
import "moment/locale/fr";

moment.locale(_getLanguageCode());

// import strings from "../strings";

export default strings = new LocalizedStrings({
    en:{
        // Page title headers
        home: 'Home',
        explore: 'Explore',
        notifications: 'Notifications',
        eatingOutList: 'Eating Out List',
        profile: 'Profile',
        settings: 'Settings',
        observationDetail: 'Detail',
        createObservation: 'Create Observation',
        signUpLogIn: 'Sign Up Log In',
        mapDetail: 'Map Detail',

        // Text when user is not logged in
        hiThere: 'Hi there,',
        welcomeToTastemate: 'Welcome to Tastemate! ',
        limitedContentExplanation: 'Unfortunately, you\'re not logged in, so we can only show you limited content and functionality. Once you\'re ready to explore more of the app, click the user icon button in the top left corner to log in or create a new account. In the meantime, ',
        haveFun: 'Have fun!',

        // Home screen
        emptyFeed: 'Seems like your feed is empty. Why not follow some tastemates?',
        selectAction: 'Select an action',
        doWithPost: 'What would you like to do with the post \"{0}\" by {1}?',
        share: 'Share',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        shareDialogTitle: 'Where do you want to share this post?',
        shareSubject: 'Cool Dish on Tastemate',
        shareMessage: 'Look at this awesome dish on Tastemate!',
        likes: '{0} likes',
        shares: '{0} shares',
        cutleries: '{0} cutleries',
        likesSg: '{0} like',
        sharesSg: '{0} share',
        cutleriesSg: '{0} cutlery',
        thousand: '{0}k', // e.g., 1k
        million: '{0}m',
        writeComment: 'Write a comment...',
        close: 'Close',

        // Notifications screen
        likedPicture: '{0} liked your picture.', // e.g. Lukas liked your picture.
        sharedPicture: '{0} shared your picture.',
        addedToEatingOutPicture: '{0} added your picture to their Eating Out list.',
        startedFollowing: '{0} started following you.',
        userAndUser: '{0} and {1}', // e.g., Tom and Susie
        others: '{0} others', // e.g. 42 others

        // Profile screen
        photos: 'Photos',
        followers: 'Followers',
        following: 'Following',
        noPictures: 'This user has not added any pictures.',
        noUsers: 'No users to display.',

        // Explore screen
        foodCraving: 'What food are you craving?',

        // Settings screen
        username: 'username',
        emailAddress: 'email address',
        location: 'location',
        oldPassword: 'old password',
        newPassword: 'new password',
        newPasswordRepeat: 'new password (repeat)',
        notifyMe: 'Notify me when...',
        likesPicture: 'someone likes my picture',
        addsToEatingOutPicture: 'someone adds my picture to their Eating Out list',
        sharesPicture: 'someone shares my picture',
        startsFollowing: 'someone starts following me',
        saveChanges: 'Save Changes',

        // Eating Out List screen
        list: 'List',
        map: 'Map',
        noEatingOut: 'Seems like you have not added a dish to your list. Just click the cutlery icon to do so!',

        // Login/Signup screen
        welcomeTo: 'Welcome to',
        tastemateDescription: 'the place to share your culinary experiences with others',
        getEating: 'Let\'s get eating!',
        signUp: 'Sign Up',
        logIn: 'Log In',
        password: 'password',
        noAccount: 'Don\'t have an account yet? Sign up here!',
        alreadyAccount: 'Already have an account? Log in here!',
        skip: 'Skip',
        errorMessageEnterUsername: 'Please enter a username.',
        errorMessageEnterEmail: 'Please enter an email address.',
        errorMessageEnterPassword: 'Please enter a password.',
        errorMessageEnterLocation: 'Please enter a location.',
        errorMessageInvalidEmail: 'The email address you entered is invalid.',
        errorMessageUserDisabled: 'The account associated with this email address has been disabled.',
        errorMessageUserNotFound: 'There is no account associated with this email address.',
        errorMessageWrongPassword: 'The password you entered is incorrect.',
        errorMessageWeakPassword: 'The password you entered is too weak.',
        errorMessageEmailAlreadyInUse: 'This email address is already connected to a Tastemate account.',

        // Create Observation screen
        next:'Next',
        previous: 'Previous',
        publish: 'Publish',
        description: 'description',
        dishname: 'dish name',
        price: 'price',
        rateExperience: 'How would you rate your overall experience?',
        currency: 'currency',
        selectCurrency: 'Please select the currency of the price you stated.',
        searchVocabulary: 'What was the taste, texture, and odor of the dish?',
        noLocationResults: 'No matching location found, please enter more information.',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        openSettings: 'Open Settings',
        accessCameraQuestion: 'May we access your camera?',
        accessCameraExplanation: 'We need access so you can take and share pictures of your food.',
        accessPhotoQuestion: 'May we access your photo roll?',
        accessPhotoExplanation: 'We need access so you can select and share pictures of your food.',
        enableCamera: 'Please enable the camera permission in the Tastemate settings of your phone to use this feature.',
        enablePhoto: 'Please enable the storage permission in the Tastemate settings of your phone to use this feature.',
        enableCameraAndPhoto: 'To upload a picture, we first need access to your camera and to the camera roll. Please click here to open the permission dialog! Alternatively, you can go to the Tastemate settings of your smartphone and grant the permissions there.',
        permissionDenied: 'Permission Denied',
        mypocExplanationTitle: 'The MyPoC Text Field',
        mypocExplanationText: 'This field displays a general dish name as predicted by our MyPoC system. Feel free to edit the name if the prediction is incorrect!',
        more: 'More',

        accessLocationQuestion: 'May we access your location?',
        accessLocationExplanation: 'We need access so you can see which saved observations are nearby.',
        enableLocation: 'Please enable the location permission in the Tastemate settings of your phone to use this feature.',

        // NEW - 20.06.2018
        editObservation: 'Edit Observation',
        save: 'Save',
        errorMessageUsernameAlreadyInUse: 'This username is already connected to a Tastemate account.',
        commentsSg: '{0} comment',
        comments: '{0} comments',
        commentedPicture: '{0} commented on your picture.',
        allComments: 'All Comments',
        missingValuesTitle: 'Missing Values',
        missingValuesTextSg: 'Please add the {0} of your dish before publishing it.',
        missingValuesTextPl: 'Please add the {0} and {1} of your dish before publishing it.',
        itemization: '{0}, {1}',
        picture:'picture',
        tasteTerms:'3 taste terms',
        lessThanKm: 'Less than {0}km away',
        furtherAway: 'Further away',
        noEatingOutList: 'Looks like you haven\'t added anything to your Eating Out list. Just click the cutlery icon next to an observation to add it to the list!',
        noNotifications: 'You do not have any notifications yet.',
        noImages: 'Looks like your camera roll is empty. Try taking a picture instead.',
        checkingUsername: 'Checking if username is already taken...',
        creatingAccount: 'Creating your account...',
        savingUserInformation: 'Saving your information...',
        loggingIn: 'Logging you in...',
        creatingAnonymous: 'Creating an anonymous account...',
        savingObservation: 'Saving observation...',
        savingProfile: 'Saving profile...',
        uploadingPicture: 'Uploading picture...',
        unknownLocation: 'Unknown location',
        loading: 'Loading...',
        errorOccurred: 'An error occurred. Please try again later.',
        noSearchResults: 'There are no observations that match your search. Please enter something else.',
        viewMoreComments: 'View more comments',
        flavor:'Flavor',
        odor:'Odor',
        texture:'Texture',

        selected:'Selected',
        noMatchingTerms: 'There are no terms that match your search.',
        noSelectedTerms: 'Click on one of the terms below to add it to your observation.',

        // NEW - 20.06.2019
        myPoc: 'MyPoC prediction',
    },
    fr: {
        explorer: 'Explorer',
        notifications: "Notifications",
        eatingOutList: 'Eating Out List',
        profile: 'Profile',
        settings: "Paramètres",
        observationDetail: 'Détail',
        createObservation: 'Créer une observation',
        signUpLogIn: 'Inscription Connexion',
        mapDetail: 'Détails de la carte',

        // Texte lorsque l'utilisateur n'est pas connecté
        hiThere: "Salut",
        welcomeToTastemate: 'Bienvenue à Tastemate!' ,
        limitedContentExplanation: 'Malheureusement, vous n\'êtes pas connecté, nous ne pouvons vous montrer que du contenu et des fonctionnalités limités. Une fois que vous êtes prêt à explorer plus l\'application, cliquez sur le bouton de l\'icône utilisateur dans le coin supérieur gauche pour vous connecter ou créer un nouveau compte. Pendant ce temps, ',
        HaveFun: 'Amusez-vous!',

        // Home screen --  Écran d'accueil
        emptyFeed: 'Votre flux semble être vide. Pourquoi ne pas suivre quelques dégustations?',
        selectAction: 'Sélectionnez une action',
        doWithPost: 'Que voudriez-vous faire avec le post \ "{0} \" par {1}',
        share: 'Partage',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        shareDialogTitle: 'Où voulez-vous partager ce post?',
        shareSubject: 'Cool Dish sur Tastemate',
        shareMessage: 'Regardez ce plat impressionnant sur Tastemate!',
        likes: '{0} aime',
        shares: '{0} partages',
        cutleries: '{0} couverts',
        likesSg: '{0} aime',
        sharesSg: '{0} partage',
        cutleriesSg: '{0} coutellerie',
        thousand: '{0}k', // e.g., 1k
        million: '{0}m',
        writeComment: 'Ecrire un commentaire ...',
        close: 'Fermer',

        // Notifications screen
        likedPicture: '{0} a aimé votre photo.', // e.g. Lukas liked your picture.
        sharedPicture: '{0} a partagé votre photo..',
        addedToEatingOutPicture: '{0} a ajouté votre image à sa liste Eating Out.',
        startedFollowing: '{0} a commencé à vous suivre.',
        userAndUser: '{0} et {1}', // e.g., Tom and Susie
        others: '{0} autres', // e.g. 42 others

        // Profile screen
        photos: 'Photos',
        followers: 'Abonnés',
        following: 'Suivant',
        noPictures: 'Cet utilisateur n\'a ajouté aucune photo.',
        noUsers: 'Aucun utilisateur à afficher.',

        // Explore screen
        foodCraving: 'De quelle nourriture avez-vous envie ?',

        // Settings screen
        username: 'username',
        emailAddress: 'adresse email',
        location: 'location',
        oldPassword: 'ancien mot de passe',
        newPassword: 'nouveau mot de passe',
        newPasswordRepeat: 'nouveau mot de passe (répétition)',
        notifyMe: 'Prévenez-moi quand ...',
        likesPicture: 'quelqu\'un aime ma photo',
        addsToEatingOutPicture: 'quelqu\'un ajoute ma photo à sa liste Eating Out',
        sharesPicture: 'quelqu\'un partage ma photo',
        startsFollowing: 'quelqu\'un commence à me suivre',
        saveChanges: 'Enregistrer les modifications',

        // Eating Out List screen
        list: 'Liste',
        map: 'Carte',
        noEatingOut: 'On dirait que vous n\'avez pas ajouté un plat à votre liste. Cliquez simplement sur l\'icône Couteau pour le faire!',

        // Login/Signup screen
        welcomeTo: 'Bienvenue à',
        tastemateDescription: 'l\'endroit pour partager vos expériences culinaires avec les autres',
        getEating: 'Allons manger!',
        signUp: 'Inscription',
        logIn: 'Connexion',
        password: 'mot de passe',
        noAccount: 'Vous n\'avez pas encore de compte? Inscrivez-vous ici!',
        alreadyAccount: 'Vous avez déjà un compte? Connectez-vous ici!',
        skip: 'Skip',

        errorMessageEnterUsername: 'Veuillez entrer un nom d\'utilisateur.',
        errorMessageEnterEmail: 'Veuillez entrer une adresse e-mail.',
        errorMessageEnterPassword: 'Veuillez entrer un mot de passe.',
        errorMessageEnterLocation: 'Veuillez entrer un lieu.',
        errorMessageInvalidEmail: 'L\'adresse e-mail que vous avez entrée est invalide.',
        errorMessageUserDisabled: 'Le compte associé à cette adresse e-mail a été désactivé.',
        errorMessageUserNotFound: 'Aucun compte n\'est associé à cette adresse e-mail.',
        errorMessageWrongPassword: 'Le mot de passe que vous avez entré est incorrect.',
        errorMessageWeakPassword: 'Le mot de passe que vous avez entré est trop faible.',
        errorMessageEmailAlreadyInUse: 'Cette adresse e-mail est déjà connectée à un compte Tastemate.',

        // Create Observation screen
        next:'Suivant',
        previous: 'Precedent',
        publish: 'Publish',
        description: 'description',
        dishname: 'nom de plat',
        price: 'prix',
        rateExperience: 'Comment évaluez-vous votre expérience majeure?',
        currency: 'Devise',
        selectCurrency: 'Veuillez sélectionner la devise du prix que vous avez indiqué.',
        searchVocabulary: 'Quels étaient le goût, la texture et l\'odeur du plat?',
        noLocationResults: 'Aucun emplacement correspondant trouvé, veuillez entrer plus d\'informations.',
        yes: 'Oui',
        no: 'Non',
        ok: 'OK',
        openSettings: 'Ouvrir les paramètres',
        accessCameraQuestion: 'Pouvons-nous accéder à votre caméra?',
        accessCameraExplanation: 'Nous avons besoin d\'un accès pour pouvoir prendre et partager des photos de votre nourriture.',
        accessPhotoQuestion: 'Pouvons-nous accéder à votre rouleau de photos?',
        accessPhotoExplanation: 'Nous avons besoin d\'un accès pour pouvoir sélectionner et partager des photos de votre nourriture.',
        enableCamera: 'Veuillez activer l\'autorisation de la caméra dans les paramètres Tastemate de votre téléphone pour utiliser cette fonction.',
        enablePhoto: 'Nous avons besoin d\'un accès pour pouvoir sélectionner et partager des photos de votre nourriture.',
        enableCameraAndPhoto: 'Veuillez activer l\'autorisation de stockage dans le paramètre Tastemate de votre téléphone pour utiliser cette fonctionnalité. S\'il vous plaît cliquez ici pour ouvrir la permission là. Vous pouvez aller aux paramètres Tastemate de votre smartphone et accorder les autorisations là.',
        permissionDenied: 'Autorisation refusée',
        mypocExplanationTitle: 'Le champ de texte MyPoC',
        mypocExplanationText: 'Ce champ affiche un nom de plat général comme prédit par notre système MyPoC. N\'hésitez pas à modifier le nom si la prédiction est incorrecte!',
        more: 'Plus',

        accessLocationQuestion: 'Pouvons-nous accéder à votre position?',
        accessLocationExplanation:'Nous avons besoin d\'un accès pour voir quelles observations sont à proximité.',
        enableLocation: 'Veuillez activer l\'autorisation de localisation dans les paramètres Tastemate',
    },
    ja: {
        // Page title headers  ----
        home: 'ホーム',
        explore: 'エクスプローラー',
        notifications: '通知',
        eatingOutList: '食べるリスト',
        profile: 'プロフィール',
        settings: '設定',
        observationDetail: '詳細',
        createObservation: '観察を作成する',
        signUpLogIn: 'サインアップログイン',
        mapDetail: 'マップ詳細',

        // Text when user is not logged in   ---- 　
        hiThere: 'こんにちは、みなさん',
        welcomeToTastemate: 'Tastemateにようこそ！ ',
        limitedContentExplanation: 'あなたはログインできません。従って、制限された内容と機能のみ使えます。いったんあなたがアプリをダウンロードする時は、ログインするために、左上コーナーのユーザーアイコンボタンをクリックするか、または新規作成してください。, ',
        haveFun: '楽しみなさい！',

        // Home screen
        emptyFeed: 'あなたのフィードは空のようです。いくつかのtastematesに従いなさい',
        selectAction: '行動を選びなさい',
        doWithPost: 'あなたは{1}によって the post \"{0}\"で何をしたいですか',
        share: '共有',
        edit: '編集しなさい',
        delete: '削除しなさい',
        cancel: '取消し',
        shareDialogTitle: 'あなたはどこでこのポストを共有したいか？',
        shareSubject: 'Tastemateの冷たい皿',
        shareMessage: 'Tastemateのこの素晴らしい皿を見なさい！',
        likes: '{0} は望む',
        shares: '{0} は分担する',
        cutleries: '{0} 刃物',
        likesSg: '{0} は望む',
        sharesSg: '{0} は分担する',
        cutleriesSg: '{0} 刃物類',
        thousand: '{0}k', // e.g., 1k
        million: '{0}m',
        writeComment: 'コメントを書きなさい…',
        close: '閉じる',


        // Notifications screen
        likedPicture: '{0} はあなたの写真が好き', // e.g. Lukas liked your picture.
        sharedPicture: '{0} はあなたの写真を共有した',
        addedToEatingOutPicture: '{0} はあなたの写真を彼らの食べるリストに追加した',
        startedFollowing: '{0} はあなたをフォローした',
        userAndUser: '{0} および {1}', // e.g., Tom and Susie
        others: '{0} 他のもの', // e.g. 42 others

        // Profile screen  -
        photos: '写真',
        followers: 'フォロワー',
        following: '後続',
        noPictures: 'このユーザーは少しの写真も追加しなかった。.',
        noUsers: '表示するユーザーはいません。',

        // Explore screen  -
        foodCraving: 'あなたはどんな食物を切望しているか？',

        // Settings screen  -
        username: 'ユーザーネーム',
        emailAddress: '電子メールアドレス',
        location: '位置',
        oldPassword: '古いパスワード',
        newPassword: '新しいパスワード',
        newPasswordRepeat: '新しいパスワード（繰り返し）',
        notifyMe: '私に通知しなさい…',
        likesPicture: '誰かは私の写真が好き…',
        addsToEatingOutPicture: '誰かが食べるリストへの私の写真を追加する',
        sharesPicture: '誰かが私の写真を共有する',
        startsFollowing: '誰かが私をフォローする',
        saveChanges: '変更を保存しなさい',

        // Eating Out List screen  -
        list: 'リスト',
        map: 'マップ',
        noEatingOut: ' 皿をあなたのリストに追加しなかった 。まさに、そうするために、刃物類アイコンをクリックしなさい！',

        // Login/Signup screen --- ログイン／サインアップスクリーン
        welcomeTo: 'するために歓迎します',
        tastemateDescription: 'あなたの料理の経験を他と共有する場所',
        getEating: '私達を、食べ始めさせなさい！',
        signUp: 'サインアップ',
        logIn: 'ログイン',
        password: 'パスワード',
        noAccount: 'まだアカウントを持っていませんか？ここにサインアップしなさい！',
        alreadyAccount: 'すでにアカウントを持ってますか ？ここにログインしなさい',
        skip: 'スキップ',
        errorMessageEnterUsername: 'どうぞ、ユーザーネームに入力してください。',
        errorMessageEnterEmail: 'どうぞ、電子メールアドレスを入力してください。',
        errorMessageEnterPassword:  'どうぞ、パスワードを入力してください。',
        errorMessageEnterLocation:  'どうぞ、位置に入ってください。',
        errorMessageInvalidEmail:  'あなたが入力した電子メールアドレスは無効である。',
        errorMessageUserDisabled:  'この電子メールアドレスと関連したアカウントは使用不可にされた。',
        errorMessageUserNotFound:  'この電子メールアドレスと関連したアカウントがない。',
        errorMessageWrongPassword:  'あなたが入力したパスワードは不正確である。',
        errorMessageWeakPassword:  'あなたが入力したパスワードは弱すぎる。',
        errorMessageEmailAlreadyInUse:  'この電子メールアドレスはすでにTastemateアカウントに接続している。',

        // Create Observation screen ----   作成観察スクリーン
        next:'次に',
        previous: '前',
        publish: '出版しなさい',
        description: '説明',
        dishname: '皿名',
        price: '価格',
        rateExperience: 'あなたはどのようにあなたの全体の経験を評価するか？',
        currency: '通貨',
        selectCurrency: 'あなたの価格の通貨を選択して下さい ',
        searchVocabulary: '味、テクスチャー、およびにおいはどうか ?',
        noLocationResults: 'どのマッチングする場所が見つからなかった どうぞ、より多くの情報を入力してください 。',
        yes: 'はい',
        no: 'いいえ',
        ok: 'OK',
        openSettings: '開いている設定',
        accessCameraQuestion: '私達はあなたのカメラにアクセスできるか？',
        accessCameraExplanation: '私達は、あなたがあなたの食物の写真をとり、共有できるようにアクセスする必要がある。',
        accessPhotoQuestion: '私達はあなたの写真ロールにアクセスできるか？',
        accessPhotoExplanation: '私達は、あなたがあなたの食物の写真を選び、共有できるようにアクセスする必要がある。',
        enableCamera: 'どうぞ、あなたの電話のTastemate設定において、カメラを許可しこの機能を使うことを可能にしてください。',
        enablePhoto: 'どうぞ、あなたの電話のTastemate設定において、ストレージの許可がこの機能を使うことを可能にしてください。',
        enableCameraAndPhoto: '写真をアップロードするためには、私達は最初、あなたのカメラとカメラロールにアクセスする必要がある。どうぞ、許可ダイアログを開くためにここをクリックしてください！代わりに、あなたはあなたのスマートフォンのTastemate設定に行き、そこに許可を与えることができる。',
        permissionDenied: '許可が否定される',
        mypocExplanationTitle: 'MyPoCテキストフィールド',
        mypocExplanationText: 'このフィールドは、私達のMyPoCシステムにより予測されるように一般皿名を表示する。もし予測が不正確ならば、名前を編集しなさい！',
        more: 'より多く',
        accessLocationQuestion: '私達はあなたの位置にアクセスできるか？',
        accessLocationExplanation: '私達は、あなたが、近くで、保存された観察がであるかをわかることができるようにアクセスする必要がある。',
        enableLocation: 'どうぞ、あなたの電話のTastemate設定において、位置許可がこの機能を使うことを可能にしてください。',
    }
});