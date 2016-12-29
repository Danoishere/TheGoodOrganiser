using Alya.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheGoodOrganiser.Core
{
    public class StockItem : EntityBase
    {
        public int Amount { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Gender Gender { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public StockItemType Type { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ClothSize ClothSize { get; set; }
        public int ShoeSize { get; set; }
    }
}
