import React from 'react'

export default ({ style = {} }) =>
    <svg width="48px" height="48px" viewBox="0 0 48 48" style={style}>
        <defs></defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
                <rect fill="#5F6884" x="0" y="0" width="48" height="48" rx="5"></rect>
                <path d="M17.9909567,30.2177406 C19.7724077,30.2186022 21.2174209,28.800201 21.2202435,27.047897 C21.2232229,25.2338724 19.8144331,23.7835142 18.0479575,23.7821043 C16.2133475,23.7805378 14.7789191,25.1882084 14.7782135,26.9908759 C14.7775078,28.7863373 16.2017435,30.2168791 17.9909567,30.2177406 M10.752327,22.8291148 C10.2963991,22.3741204 9.84023597,21.9259404 9.3933247,21.4685963 C9.26230913,21.3345026 9.14501453,21.1827856 9.04394985,21.0247242 C8.89623392,20.7937415 8.91301269,20.5515582 9.06276717,20.3247268 C9.13419457,20.2164806 9.21432498,20.1109758 9.30558896,20.0192564 C9.80299337,19.519538 10.2967911,19.0156684 10.8082301,18.5305969 C11.2146841,18.1451558 11.5833467,18.1405346 12.0018752,18.5246442 C12.4681527,18.9526161 12.9113005,19.4058873 13.3574277,19.8551639 C13.4524551,19.9507996 13.516042,19.9663081 13.6361592,19.8914287 C14.3269115,19.461107 15.0682354,19.1427127 15.8562889,18.9381259 C15.9811105,18.905699 16.0222733,18.8525941 16.0218813,18.7253148 C16.0202348,18.1316838 16.0261936,17.5378962 16.0345046,16.9442652 C16.0359943,16.8344525 16.0526163,16.7231516 16.0765299,16.6156887 C16.1546218,16.2654158 16.3474993,16.0855016 16.6998536,16.03318 C16.8220877,16.0150084 16.9465172,16.0035728 17.0700059,16.0030245 C17.7167727,16.0001265 18.363618,15.9981683 19.0103064,16.0026329 C19.6809869,16.0072541 19.9528972,16.2737184 19.964658,16.940114 C19.9749291,17.5206645 19.9806527,18.1013717 19.9753211,18.6819223 C19.9739098,18.8392004 20.0147591,18.905934 20.1752551,18.9479166 C20.9499013,19.1503103 21.6788371,19.4663548 22.3586127,19.8891573 C22.4762993,19.9623919 22.5409055,19.9572224 22.6381283,19.8583752 C23.0637917,19.4255471 23.4957275,18.9986717 23.9325244,18.5769658 C24.0343732,18.4786669 24.1571562,18.3964249 24.2824481,18.329378 C24.5057469,18.2099312 24.7377488,18.2148658 24.9523446,18.353659 C25.0775582,18.4347262 25.1986946,18.5273072 25.304542,18.6320288 C25.7825803,19.1049597 26.2625003,19.5764025 26.7263471,20.0631188 C27.1655747,20.5240659 27.1738072,20.8563238 26.7401465,21.3231453 C26.3005269,21.7964679 25.835504,22.2466061 25.3730684,22.6981541 C25.2661234,22.8025623 25.2633008,22.8710974 25.3231241,23.009499 C25.5836656,23.6121374 25.8301724,24.2214335 26.0599789,24.8363691 C26.1138435,24.9804885 26.1666104,25.0263874 26.3152672,25.0255258 C26.9291037,25.0220012 27.5431755,25.023646 28.1568552,25.0379796 C28.6900125,25.0504334 28.9581593,25.2742884 28.9781527,25.8051805 C29.0084172,26.6057481 29.0071627,27.4092138 28.9748597,28.2097031 C28.9543958,28.7183506 28.6837401,28.9473751 28.1766918,28.9606905 C27.5500752,28.9770606 26.9229097,28.9765906 26.2959794,28.9745541 C26.1627685,28.9740842 26.1030235,29.0094091 26.0675058,29.145461 C25.8635732,29.9262122 25.5486967,30.6616127 25.1170745,31.3441434 C25.0392179,31.4671932 25.0501946,31.5378431 25.1529058,31.638805 C25.6231035,32.1010836 26.084755,32.5720564 26.5483667,33.0409928 C26.598703,33.0918262 26.6449622,33.1474375 26.6879284,33.2047719 C26.9829683,33.5980456 26.9723051,33.9069624 26.6524108,34.2788531 C26.6183828,34.3183293 26.5833355,34.3571789 26.5464065,34.3940703 C26.0755816,34.8650431 25.6053055,35.3367992 25.13205,35.8054223 C25.0490186,35.887586 24.9575978,35.9634053 24.861551,36.0300605 C24.5984222,36.2125596 24.324003,36.2233685 24.0569539,36.0436892 C23.9170786,35.94962 23.7830052,35.842392 23.6627312,35.7244334 C23.1966889,35.2670893 22.7352727,34.8049673 22.2769926,34.3398689 C22.1959213,34.2575485 22.1360979,34.2394553 22.028996,34.3003927 C21.4307622,34.6407182 20.7949721,34.8926921 20.1289959,35.0655571 C20.0108388,35.0962608 19.9764188,35.1512455 19.9765756,35.2684208 C19.9774381,35.8620518 19.9723417,36.4557611 19.9640308,37.049392 C19.9623842,37.1657841 19.9446646,37.2833511 19.9214566,37.3977067 C19.8554392,37.722132 19.6511145,37.908704 19.327143,37.9639236 C19.2244318,37.9814686 19.1197605,37.9960372 19.0158732,37.9965071 C18.3364897,37.9994052 17.6569493,38.0025382 16.9775658,37.9967421 C16.3237424,37.9911027 16.0479903,37.7200172 16.0342694,37.0665454 C16.0220381,36.4860731 16.0168634,35.9052093 16.0235278,35.3246587 C16.025488,35.15665 15.9662134,35.1038584 15.8117546,35.0463673 C15.2022304,34.8193009 14.5985081,34.5750812 14.0019992,34.3156662 C13.8608693,34.2542588 13.7934406,34.2637363 13.6912782,34.3685361 C13.2537756,34.8174211 12.807962,35.2582385 12.3624621,35.6992125 C12.270022,35.790697 12.1714663,35.8781086 12.0663245,35.9543979 C11.7205563,36.2054319 11.3983882,36.2189823 11.08704,35.9252607 C10.4892766,35.3613152 9.90742947,34.7790415 9.34275316,34.1819642 C9.05233924,33.8749272 9.06206152,33.5646788 9.30809794,33.2216903 C9.40273336,33.0898681 9.51375553,32.9681498 9.62807073,32.8523843 C10.0363281,32.4388243 10.4467808,32.0273791 10.8623299,31.6211033 C10.9490464,31.5362765 10.9560244,31.4756524 10.8917319,31.3724974 C10.4542293,30.6708552 10.1293954,29.9192412 9.9235026,29.1184386 C9.89127794,28.993039 9.82322198,28.9758074 9.71298387,28.975729 C9.09256126,28.9751807 8.47198183,28.9763556 7.85179444,28.9621003 C7.30609225,28.9494899 7.04202258,28.7316659 7.02038266,28.1831506 C6.98855003,27.3763953 6.99654739,26.5665069 7.02681191,25.7593599 C7.04406112,25.2990394 7.32890825,25.0547413 7.79753784,25.040486 C8.41098236,25.0218445 9.02521094,25.0206696 9.63904749,25.0262308 C9.81506781,25.0277973 9.88422145,24.9822117 9.94914119,24.8034723 C10.1732241,24.1868919 10.4338439,23.5834702 10.6812916,22.975349 C10.700501,22.9280402 10.7259043,22.8832379 10.752327,22.8291148" fill="#FFFFFF"></path>
                <path d="M34.9942452,19.0476531 C36.1278958,19.0482014 37.0474496,18.1455824 37.0492458,17.0304799 C37.0511418,15.8761006 36.1546392,14.9531454 35.0305184,14.9522482 C33.8630393,14.9512513 32.9502213,15.8470417 32.9497722,16.9941937 C32.9493232,18.1367601 33.855655,19.0471049 34.9942452,19.0476531 M30.3878445,14.3458003 C30.0977085,14.0562585 29.8074229,13.771053 29.5230248,13.4800158 C29.4396513,13.3946835 29.3650092,13.2981363 29.3006954,13.1975518 C29.2066943,13.0505628 29.2173717,12.8964462 29.31267,12.7520989 C29.3581238,12.6832149 29.4091159,12.6160755 29.467193,12.5577086 C29.7837231,12.239706 30.097958,11.9190617 30.4234192,11.6103799 C30.6820717,11.3650992 30.9166752,11.3621584 31.1830115,11.6065917 C31.4797335,11.8789375 31.7617367,12.1673828 32.0456358,12.4532861 C32.1061078,12.5141452 32.1465722,12.5240143 32.2230104,12.4763637 C32.6625801,12.2025226 33.1343316,11.9999081 33.6358202,11.8697165 C33.7152521,11.8490812 33.7414467,11.8152872 33.7411972,11.7342912 C33.7401494,11.3565261 33.7439414,10.9786612 33.7492302,10.6008961 C33.7501782,10.5310152 33.7607558,10.4601874 33.7759736,10.3918019 C33.8256684,10.168901 33.9484086,10.0544101 34.1726341,10.0211145 C34.2504194,10.0095508 34.3296019,10.0022736 34.4081855,10.0019247 C34.8197645,10.0000805 35.2313933,9.9988344 35.6429223,10.0016755 C36.069719,10.0046163 36.2427527,10.1741844 36.2502369,10.5982543 C36.2567731,10.9676956 36.2604154,11.3372366 36.2570225,11.7066778 C36.2561244,11.8067639 36.2821194,11.8492307 36.3842533,11.8759469 C36.8772099,12.0047429 37.3410782,12.2058621 37.7736626,12.4749183 C37.8485541,12.5215221 37.8896671,12.5182324 37.9515362,12.4553297 C38.2224129,12.1798936 38.4972811,11.9082456 38.7752428,11.6398873 C38.8400556,11.5773335 38.9181903,11.5249977 38.9979215,11.4823315 C39.1400208,11.4063199 39.2876583,11.40946 39.4242193,11.497783 C39.5039006,11.5493712 39.5809875,11.6082864 39.6483449,11.6749274 C39.9525511,11.9758835 40.2579547,12.2758925 40.55313,12.585621 C40.8326384,12.878951 40.8378773,13.0903879 40.5619114,13.3874561 C40.2821535,13.6886614 39.9862298,13.975113 39.6919526,14.2624617 C39.6238967,14.3289033 39.6221005,14.3725165 39.6601699,14.4605903 C39.825969,14.8440875 39.982837,15.2318213 40.1290775,15.623144 C40.1633549,15.7148563 40.1969339,15.7440647 40.2915336,15.7435164 C40.6821569,15.7412735 41.0729299,15.7423202 41.4634533,15.7514416 C41.8027352,15.7593667 41.9733741,15.9018199 41.9860972,16.2396603 C42.0053564,16.7491124 42.0045581,17.2604088 41.9840016,17.769811 C41.9709792,18.0934958 41.7987437,18.2392387 41.4760766,18.2477121 C41.0773206,18.2581295 40.6782153,18.2578304 40.2792596,18.2565345 C40.194489,18.2562354 40.1564695,18.2787149 40.1338673,18.3652933 C40.004092,18.862135 39.8037161,19.3301172 39.5290474,19.7644549 C39.4795023,19.8427593 39.4864875,19.8877183 39.5518492,19.9519668 C39.8510659,20.2461441 40.1448441,20.5458541 40.4398697,20.8442681 C40.4719019,20.8766167 40.5013396,20.9120057 40.5286817,20.9484912 C40.7164344,21.1987563 40.7096487,21.3953397 40.5060796,21.6319974 C40.4844254,21.6571187 40.4621226,21.6818411 40.4386223,21.7053175 C40.1390065,22.0050275 39.8397399,22.3052359 39.5385773,22.6034505 C39.4857391,22.6557365 39.4275622,22.7039852 39.3664416,22.7464022 C39.198996,22.8625379 39.0243656,22.8694163 38.8544252,22.755075 C38.7654136,22.6952127 38.6800942,22.6269767 38.6035562,22.5519122 C38.3069839,22.260875 38.0133553,21.9667974 37.7217226,21.6708257 C37.6701318,21.61844 37.6320623,21.6069261 37.5639066,21.6457045 C37.1832123,21.8622752 36.7786186,22.0226223 36.3548156,22.1326272 C36.2796247,22.152166 36.2577211,22.1871562 36.2578209,22.2617223 C36.2583697,22.6394875 36.2551266,23.0173025 36.2498378,23.3950676 C36.24879,23.4691353 36.2375138,23.5439507 36.2227451,23.6167224 C36.180734,23.8231749 36.0507092,23.9419025 35.8445455,23.9770423 C35.7791839,23.9882073 35.7125749,23.9974782 35.6464648,23.9977773 C35.2141298,23.9996215 34.781695,24.0016152 34.34936,23.9979268 C33.9332906,23.9943381 33.757812,23.8218291 33.7490805,23.4059834 C33.741297,23.036592 33.738004,22.6669514 33.742245,22.2975101 C33.7434923,22.1905954 33.7057722,22.1570008 33.6074802,22.1204155 C33.2196011,21.9759188 32.8354143,21.8205062 32.4558177,21.655424 C32.3660077,21.6163465 32.3230986,21.6223776 32.2580862,21.6890684 C31.9796754,21.9747225 31.6959758,22.2552427 31.4124759,22.5358625 C31.3536504,22.5940799 31.2909331,22.6497054 31.2240247,22.6982532 C31.0039904,22.8580021 30.7989743,22.8666251 30.6008436,22.6797113 C30.2204487,22.3208369 29.8501824,21.9502991 29.4908429,21.5703408 C29.3060341,21.3749537 29.312221,21.1775229 29.4687896,20.9592575 C29.5290121,20.8753706 29.5996626,20.7979135 29.6724086,20.7242446 C29.9322088,20.46107 30.193406,20.1992412 30.4578463,19.9407021 C30.5130295,19.8867214 30.5174701,19.8481424 30.4765567,19.7824983 C30.1981459,19.3359988 29.9914334,18.8576989 29.8604107,18.3480973 C29.8399041,18.2682976 29.7965958,18.257332 29.7264443,18.2572821 C29.3316299,18.2569332 28.9367157,18.2576809 28.542051,18.2486093 C28.194786,18.2405845 28.0267416,18.1019692 28.0129708,17.752914 C27.9927137,17.2395243 27.9978029,16.7241407 28.0170621,16.2105018 C28.0280389,15.9175705 28.2093052,15.7621081 28.5075241,15.7530366 C28.8978979,15.7411738 29.2887706,15.7404261 29.6793939,15.743965 C29.7914068,15.7449619 29.8354136,15.7159529 29.8767262,15.6022096 C30.0193244,15.2098403 30.1851734,14.8258447 30.3426401,14.4388584 C30.3548643,14.4087529 30.37103,14.3802423 30.3878445,14.3458003" fill="#BED0FF"></path>
            </g>
        </g>
    </svg>