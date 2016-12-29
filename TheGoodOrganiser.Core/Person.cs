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
    public class PersonNeed : EntityBase
    {
        public int FK_Order { get; set; }
        public virtual Order Order { get; set; }


        public string Name { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Gender Gender { get; set; }


        public bool NeedsShoes { get; set; }
        public int ShoeSize { get; set; }

        public bool NeedsPants { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ClothSize PantsSize { get; set; }

        public bool NeedsTop { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ClothSize TopSize { get; set; }

        public bool NeedsJacket { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ClothSize JacketSize { get; set; }

        public bool NeedsHygiene { get; set; }
    }
}
