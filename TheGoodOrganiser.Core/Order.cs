using Alya.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheGoodOrganiser.Core
{
    public class Order : EntityBase
    {
        public string ReferenceCode { get; set; }
        public string Language { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? FinishedOn { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public OrderState State { get; set; }

        public string WhatsappNumber { get; set; }
        public string WorkingPhoneNumber { get; set; }
        public string ReceiverName { get; set; }
        public string Camp { get; set; }

        public virtual Collection<PersonNeed> PersonNeeds { get; set; }
    }
}
