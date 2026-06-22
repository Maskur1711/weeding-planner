const fs = require('fs');
const pg = require('pg');
const url = require('url');

const config = {
    user: "avnadmin",
    password: process.env.DB_PASSWORD,
    host: "pg-1d8a67fb-dimaskurniawan2290-959e.j.aivencloud.com",
    port: 10922,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUCZzKAxBhbYI46fZ1hEe+PTc3dEwwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYzdkYzgzMGEtMDBhOS00ZWZmLTk3MjEtNWZiZTBhMGE4
OTI2IFByb2plY3QgQ0EwHhcNMjYwNjIyMDk0NDUwWhcNMzYwNjE5MDk0NDUwWjA6
MTgwNgYDVQQDDC9jN2RjODMwYS0wMGE5LTRlZmYtOTcyMS01ZmJlMGEwYTg5MjYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMGiQQQv
BG4rwRQJEQUc87xTOOoJIAcCna825OKbf97tgVMObTh0JXIxVDLsigW/otwcKjO3
+N+zD5ZejCVl2sREHneTDZPlBZmQwjJJy1ktsGawKnXRvNbjwuhARXukZPhtjm1k
tmXVq4VjezzL7RxE3QJKBRYxdPMIJ3wontsdDS4neRRwItH6yliab2PIvit5y7tL
m18rUW6Uftl8H7y/A8X/eYAw51sr3SGurHEzgThGrtRr/IzQx+7fLkdsnITPxC76
tM3o4X1n2f6+7BsoXLXvNFVTm2vVjMqO8CSXkeEWSj50RWoLqmOxkEngoBof3tdP
F7L8FB8WemEeYH0HFLNWKTRSXYz6Nn7XfwYNH1PKBHhEjYf2m/beMtMeEaaYBts1
XL93GOZvXKmM2pPTjbayOhpVqtiRzGgN7kqw4SmUfIqrdvRxmT0OQW4JxuGntova
envWMtt93pvDboCLiKj1cfyxoAAZwlStPvBhRjjXWl/yCWKCBpGh5UVKzwIDAQAB
o0IwQDAdBgNVHQ4EFgQUazhCHHrs2wbzahEslGTvAfvM38swEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAIOa+9L26+e9
rHLAuFbB+ftBikDbSw7pSBo2vxzotqNq0fvN5ONJ9/1kvWUGIVFM67eO5B4l9GPh
gbIq0BJtGEr2uCWXUeMzed8Ob/z+FLr6k4vPPXdDoNo6wr0nVDNZDDi2yUYE2z9M
5e7/p6/ntGKi55rHaGjqjw/IIr872J9J9HH0M6f6MPMN71M3babeXpv9KQBelv+a
4NFt1JpMIdLrVUQyEdLzd0Ql4daCvKglDXarQe+K+WZZxtwFx6O9qS/AHvrO6NIV
x5JtI8mR91nrtj5BsL9rdvksGAI4dkRWm8U/ZQC0jINXz7cwljUCYnke9il9btaP
z3XvllZyxXhjSnHOtyB6Iz2I+L1N1/98Gamze7FBqEUy0vSGH3SwIj089JTN38r+
3B7XRQywL6V4YGk9sdEyVXmLOyPSoAUCUC9b8/DrPlRLOo0ORZ8+QnLyIwGobzjG
MFcD7O2WfEe/V8G4OyKhkjEWue6FBGfejD20tYFcUuvQenAv6X4s4g==
-----END CERTIFICATE-----
`,
    },
};

const client = new pg.Client(config);
client.connect(function (err: any) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err: any, result: any) {
        if (err)
            throw err;

        console.log("Berhasil! Versi Database:", result.rows[0].version);
        client.end(function (err: any) {
            if (err)
                throw err;
        });
    });
});