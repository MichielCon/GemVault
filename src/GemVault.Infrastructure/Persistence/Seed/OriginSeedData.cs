using GemVault.Domain.Entities;

namespace GemVault.Infrastructure.Persistence.Seed;

public static class OriginSeedData
{
    private static readonly DateTime SeedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static IEnumerable<Origin> GetAll()
    {
        var items = new List<Origin>();
        items.AddRange(GetCountries());
        items.AddRange(GetLocalities());
        return items;
    }

    private static IEnumerable<Origin> GetCountries()
    {
        var countries = new[]
        {
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
            "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
            "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
            "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
            "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
            "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
            "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
            "China", "Colombia", "Comoros", "Democratic Republic of Congo", "Republic of Congo",
            "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
            "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
            "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
            "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
            "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
            "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
            "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
            "India", "Indonesia", "Iran", "Iraq", "Ireland",
            "Israel", "Italy", "Jamaica", "Japan", "Jordan",
            "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
            "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
            "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
            "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
            "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
            "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
            "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
            "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
            "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
            "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
            "Peru", "Philippines", "Poland", "Portugal", "Qatar",
            "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
            "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
            "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
            "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
            "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
            "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
            "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
            "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
            "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
            "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
            "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
        };

        var result = new List<Origin>(countries.Length);
        for (int i = 0; i < countries.Length; i++)
        {
            result.Add(new Origin
            {
                Id = new Guid($"{(i + 1):D8}-0000-0000-0000-000000000001"),
                Country = countries[i],
                Locality = null,
                CreatedAt = SeedDate,
                UpdatedAt = SeedDate,
                IsDeleted = false,
            });
        }
        return result;
    }

    private static IEnumerable<Origin> GetLocalities()
    {
        var localities = new[]
        {
            ("Sri Lanka", "Ratnapura"),
            ("Sri Lanka", "Elahera"),
            ("Myanmar", "Mogok"),
            ("Myanmar", "Mong Hsu"),
            ("Myanmar", "Mandalay"),
            ("Colombia", "Muzo"),
            ("Colombia", "Chivor"),
            ("Colombia", "Coscuez"),
            ("Zambia", "Kagem"),
            ("Zambia", "Kafubu"),
            ("Brazil", "Minas Gerais"),
            ("Brazil", "Bahia"),
            ("Brazil", "Paraiba"),
            ("Madagascar", "Ilakaka"),
            ("Madagascar", "Andilamena"),
            ("Tanzania", "Merelani"),
            ("Tanzania", "Tunduru"),
            ("Tanzania", "Umba Valley"),
            ("Kenya", "Tsavo"),
            ("Kenya", "Baringo"),
            ("Afghanistan", "Jegdalek"),
            ("Afghanistan", "Panjshir Valley"),
            ("Pakistan", "Hunza Valley"),
            ("Pakistan", "Swat Valley"),
            ("Pakistan", "Chitral"),
            ("India", "Jaipur"),
            ("India", "Panna"),
            ("India", "Kashmir"),
            ("Russia", "Ural Mountains"),
            ("Russia", "Siberia"),
            ("Australia", "Lightning Ridge"),
            ("Australia", "Coober Pedy"),
            ("Australia", "Argyle"),
            ("Cambodia", "Pailin"),
            ("Thailand", "Chanthaburi"),
            ("Thailand", "Kanchanaburi"),
            ("Vietnam", "Luc Yen"),
            ("Vietnam", "Quy Chau"),
            ("China", "Yunnan"),
            ("China", "Xinjiang"),
            ("Ethiopia", "Welo"),
            ("Ethiopia", "Shewa"),
            ("Nigeria", "Jos Plateau"),
            ("Nigeria", "Kaduna"),
            ("Mozambique", "Montepuez"),
            ("Democratic Republic of Congo", "Mbuji-Mayi"),
            ("Democratic Republic of Congo", "Katanga"),
            ("Zimbabwe", "Sandawana"),
            ("South Africa", "Kimberley"),
            ("South Africa", "Messina"),
            ("Canada", "British Columbia"),
            ("United States", "Montana"),
            ("United States", "California"),
            ("United States", "North Carolina"),
            ("Mexico", "Guerrero"),
            ("Peru", "Pisco"),
            ("Bolivia", "Anahi Mine"),
            ("Iran", "Nishapur"),
            ("Turkey", "Milas"),
            ("Tajikistan", "Pamir Mountains"),
            ("Nepal", "Ganesh Himal"),
            ("Indonesia", "Kalimantan"),
            ("Philippines", "Palawan"),
            ("Laos", "Vang Vieng"),
        };

        var result = new List<Origin>(localities.Length);
        for (int i = 0; i < localities.Length; i++)
        {
            result.Add(new Origin
            {
                Id = new Guid($"{(i + 1):D8}-0000-0000-0000-000000000002"),
                Country = localities[i].Item1,
                Locality = localities[i].Item2,
                CreatedAt = SeedDate,
                UpdatedAt = SeedDate,
                IsDeleted = false,
            });
        }
        return result;
    }
}
