export const LoginPageLeftCard= () => {
    return (
        <>
        <div
          className="bg-secondary-subtle shadow rounded-3 p-4 d-flex flex-column justify-content-center"
          style={{
            width: "720px",
            height: "320px",
            backgroundImage:
              "url('https://i1.sdlcdn.com/img/snapdeal/sprite/userAuthSpritev3.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="d-flex align-items-start mb-4">
            <span className="material-symbols-outlined fs-2 me-3 text-warning">
              location_on
            </span>
            <div>
              <div className="fw-semibold" style={{ fontSize: "14px" }}>
                MANAGE YOUR ORDERS
              </div>
              <div className="small text-muted" style={{ fontSize: "12px" }}>
                Track orders, manage cancellations & returns.
              </div>
            </div>
          </div>

          <div className="d-flex align-items-start">
            <span className="material-symbols-outlined fs-2 me-3 text-warning">
              notifications
            </span>
            <div>
              <div className="fw-semibold" style={{ fontSize: "14px" }}>
                AWESOME OFFERS UPDATES FOR YOU
              </div>
              <div className="small text-muted" style={{ fontSize: "12px" }}>
                Be first to know about great offers and save.
              </div>
            </div>
          </div>
        </div>
        </>
    )
}