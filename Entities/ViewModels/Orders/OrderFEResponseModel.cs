﻿using System.Collections.Generic;

namespace Entities.ViewModels.Orders
{
    public class OrderFEResponseModel
    {
        public List<OrderESModel> data {  get; set; }
        public List<OrderDetailMongoDbModel> data_order {  get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }
        public long total { get; set; }
    }
}
