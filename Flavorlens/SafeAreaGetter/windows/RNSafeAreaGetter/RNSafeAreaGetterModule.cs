using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Safe.Area.Getter.RNSafeAreaGetter
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNSafeAreaGetterModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNSafeAreaGetterModule"/>.
        /// </summary>
        internal RNSafeAreaGetterModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNSafeAreaGetter";
            }
        }
    }
}
