              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">probar sin cuenta</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Professional demo */}
              <button
                id="demo-professional-btn"
                type="button"
                onClick={() => handleDemoLogin('professional')}
                disabled={demoLoading !== null}
                className="flex flex-col items-center gap-2 p-3.5 border border-primary/30 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] group"
              >
                {demoLoading === 'professional' ? (
                  <span className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Stethoscope className="size-5" />
                )}
                <div className="text-center">
                  <p className="text-xs font-bold leading-tight">Profesional</p>
                  <p className="text-[10px] text-primary/70 leading-tight mt-0.5">Dr. Romero</p>
                </div>
              </button>

              {/* Patient demo */}
              <button
                id="demo-patient-btn"
                type="button"
                onClick={() => handleDemoLogin('patient')}
                disabled={demoLoading !== null}
                className="flex flex-col items-center gap-2 p-3.5 border border-secondary/30 bg-secondary/5 text-secondary rounded-xl hover:bg-secondary/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] group"
              >
                {demoLoading === 'patient' ? (
                  <span className="size-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                ) : (
                  <UserRound className="size-5" />
                )}
                <div className="text-center">
                  <p className="text-xs font-bold leading-tight">Paciente</p>
                  <p className="text-[10px] text-secondary/70 leading-tight mt-0.5">Ana López</p>
                </div>
              </button>
            </div>
            <p className="text-[11px] text-center text-muted-foreground mt-2">
              Sin registro · Datos de ejemplo precargados · Acceso inmediato
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>

          <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-[10px] text-center text-muted-foreground">
              🔒 Conexión segura SSL · Datos protegidos según HIPAA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

